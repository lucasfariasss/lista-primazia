import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { EntradaLEC, FilterLEC } from '@/types/sgfc'
import { Database } from '@/integrations/supabase/types'

interface LECRawData {
  id: number
  prontuario: number
  cod_procedimento: number
  matricula_medico: number | null
  cod_especialidade: number
  data_entrada: string
  prioridade: Database['public']['Enums']['prioridade_enum']
  ativo: boolean
  motivo_saida: Database['public']['Enums']['motivo_saida_enum'] | null
  observacoes: string | null
  medida_judicial: boolean
  situacao: Database['public']['Enums']['situacao_enum']
  data_novo_contato: string | null
  // Dados das tabelas relacionadas
  pacientes: {
    PRONTUARIO_PAC: number
    NOME_PACIENTE: string | null
    DDD_FONE_RESIDENCIAL: string | null
    FONE_RESIDENCIAL: string | null
    DDD_FONE_RECADO: string | null
    FONE_RECADO: string | null
  } | null
  especialidades: {
    COD_ESPECIALIDADE: number
    NOME_ESPECIALIDADE: string | null
  } | null
  procedimentos: {
    COD_PROCEDIMENTO: number
    PROCEDIMENTO: string | null
    COD_ESPECIALIDADE_FK: number | null
  } | null
  profissionais: {
    MATRICULA: number
    NOME_PROFISSIONAL: string | null
    PROF_RESPONSAVEL: number | null
  } | null
}

export function useListaEsperaCirurgica(filters: FilterLEC = {}) {
  const [entradas, setEntradas] = useState<EntradaLEC[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEntradas = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('lista_espera_cirurgica')
        .select(`
          *,
          pacientes:prontuario (
            PRONTUARIO_PAC,
            NOME_PACIENTE,
            DDD_FONE_RESIDENCIAL,
            FONE_RESIDENCIAL,
            DDD_FONE_RECADO,
            FONE_RECADO
          ),
          especialidades:cod_especialidade (
            COD_ESPECIALIDADE,
            NOME_ESPECIALIDADE
          ),
          procedimentos:cod_procedimento (
            COD_PROCEDIMENTO,
            PROCEDIMENTO,
            COD_ESPECIALIDADE_FK
          ),
          profissionais:matricula_medico (
            MATRICULA,
            NOME_PROFISSIONAL,
            PROF_RESPONSAVEL
          )
        `)
        .eq('ativo', true)
        .order('data_entrada', { ascending: true })

      // Aplicar filtros
      if (filters.especialidadeId) {
        query = query.eq('cod_especialidade', parseInt(filters.especialidadeId))
      }
      if (filters.procedimentoId) {
        query = query.eq('cod_procedimento', parseInt(filters.procedimentoId))
      }
      if (filters.medicoId) {
        query = query.eq('matricula_medico', parseInt(filters.medicoId))
      }
      if (filters.urgencia !== undefined) {
        query = query.eq('prioridade', filters.urgencia ? 'BRE' : 'SEM')
      }
      if (filters.oncologico !== undefined) {
        query = query.eq('prioridade', filters.oncologico ? 'ONC' : 'SEM')
      }
      if (filters.ordemJudicial !== undefined) {
        query = query.eq('medida_judicial', filters.ordemJudicial)
      }
      if (filters.dataInicio) {
        query = query.gte('data_entrada', filters.dataInicio)
      }
      if (filters.dataFim) {
        query = query.lte('data_entrada', filters.dataFim)
      }

      const { data, error: queryError } = await query

      if (queryError) {
        throw new Error(queryError.message)
      }

      // Transformar dados para o formato EntradaLEC
      const entradasFormatadas: EntradaLEC[] = (data as LECRawData[])
        .map((item, index) => {
          // Calcular dias de espera
          const dataEntrada = new Date(item.data_entrada)
          const hoje = new Date()
          const diasEspera = Math.floor((hoje.getTime() - dataEntrada.getTime()) / (1000 * 60 * 60 * 24))

          // Calcular score de prioridade
          let multiplicador = 1
          if (item.medida_judicial) multiplicador = 99
          else if (item.prioridade === 'BRE') multiplicador = 1.5
          else if (item.prioridade === 'ONC') multiplicador = 1.3

          const scorePrioridade = diasEspera * multiplicador

          // Formatar telefone
          const telefone = item.pacientes?.DDD_FONE_RESIDENCIAL && item.pacientes?.FONE_RESIDENCIAL
            ? `(${item.pacientes.DDD_FONE_RESIDENCIAL}) ${item.pacientes.FONE_RESIDENCIAL}`
            : item.pacientes?.DDD_FONE_RECADO && item.pacientes?.FONE_RECADO
            ? `(${item.pacientes.DDD_FONE_RECADO}) ${item.pacientes.FONE_RECADO}`
            : undefined

          return {
            id: item.id.toString(),
            pacienteId: item.prontuario.toString(),
            paciente: {
              id: item.prontuario.toString(),
              prontuario: item.prontuario.toString(),
              name: item.pacientes?.NOME_PACIENTE || 'Nome não disponível',
              cpf: undefined, // Não disponível na base atual
              birthDate: undefined, // Não disponível na base atual
              phone: telefone
            },
            especialidadeId: item.cod_especialidade.toString(),
            especialidade: {
              id: item.cod_especialidade.toString(),
              codigo: item.cod_especialidade.toString(),
              name: item.especialidades?.NOME_ESPECIALIDADE || 'Especialidade não encontrada'
            },
            procedimentoId: item.cod_procedimento.toString(),
            procedimento: {
              id: item.cod_procedimento.toString(),
              codigo: item.cod_procedimento.toString(),
              name: item.procedimentos?.PROCEDIMENTO || 'Procedimento não encontrado',
              especialidadeId: item.cod_especialidade.toString()
            },
            medicoId: item.matricula_medico?.toString() || '',
            medico: {
              id: item.matricula_medico?.toString() || '',
              crm: item.matricula_medico?.toString() || '',
              name: item.profissionais?.NOME_PROFISSIONAL || 'Médico não encontrado',
              especialidades: [item.cod_especialidade.toString()]
            },
            dataEntrada: item.data_entrada.split('T')[0], // Formato YYYY-MM-DD
            urgencia: item.prioridade === 'BRE',
            oncologico: item.prioridade === 'ONC',
            ordemJudicial: item.medida_judicial,
            observacoes: item.observacoes || undefined,
            diasEspera,
            scorePrioridade,
            posicao: index + 1, // Temporário, deve ser calculado após ordenação
            ativo: item.ativo,
            motivoRemocao: item.motivo_saida || undefined,
            criadoPor: 'sistema', // Não disponível na base atual
            criadoEm: item.data_entrada
          }
        })
        .sort((a, b) => {
          // Ordenar por prioridade (score descendente)
          if (b.scorePrioridade !== a.scorePrioridade) {
            return b.scorePrioridade - a.scorePrioridade
          }
          // Em caso de empate, ordenar por data de entrada (mais antigo primeiro)
          return new Date(a.dataEntrada).getTime() - new Date(b.dataEntrada).getTime()
        })
        .map((entrada, index) => ({
          ...entrada,
          posicao: index + 1 // Recalcular posição após ordenação
        }))

      setEntradas(entradasFormatadas)
    } catch (err: any) {
      console.error('Erro ao buscar lista de espera cirúrgica:', err)
      setError(err.message || 'Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchEntradas()
  }, [fetchEntradas])

  const refetch = useCallback(() => {
    fetchEntradas()
  }, [fetchEntradas])

  // Estatísticas calculadas
  const stats = {
    totalPacientes: entradas.length,
    tempoMedioEspera: entradas.length > 0 
      ? Math.round(entradas.reduce((acc, e) => acc + e.diasEspera, 0) / entradas.length)
      : 0,
    pacientesUrgentes: entradas.filter(e => e.urgencia).length,
    pacientesOncologicos: entradas.filter(e => e.oncologico).length,
    pacientesJudiciais: entradas.filter(e => e.ordemJudicial).length,
    porSituacao: entradas.reduce((acc, entrada) => {
      const situacao = entrada.urgencia ? 'urgente' 
        : entrada.oncologico ? 'oncologico'
        : entrada.ordemJudicial ? 'judicial'
        : 'normal'
      acc[situacao] = (acc[situacao] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  // Buscar entrada específica
  const getEntrada = useCallback(async (id: string) => {
    try {
      const { data, error: queryError } = await supabase
        .from('lista_espera_cirurgica')
        .select(`
          *,
          pacientes:prontuario (
            PRONTUARIO_PAC,
            NOME_PACIENTE,
            DDD_FONE_RESIDENCIAL,
            FONE_RESIDENCIAL,
            DDD_FONE_RECADO,
            FONE_RECADO
          ),
          especialidades:cod_especialidade (
            COD_ESPECIALIDADE,
            NOME_ESPECIALIDADE
          ),
          procedimentos:cod_procedimento (
            COD_PROCEDIMENTO,
            PROCEDIMENTO,
            COD_ESPECIALIDADE_FK
          ),
          profissionais:matricula_medico (
            MATRICULA,
            NOME_PROFISSIONAL,
            PROF_RESPONSAVEL
          )
        `)
        .eq('id', parseInt(id))
        .single()

      if (queryError) {
        throw new Error(queryError.message)
      }

      if (!data) {
        return null
      }

      const item = data as LECRawData
      
      // Calcular dias de espera
      const dataEntrada = new Date(item.data_entrada)
      const hoje = new Date()
      const diasEspera = Math.floor((hoje.getTime() - dataEntrada.getTime()) / (1000 * 60 * 60 * 24))

      // Calcular score de prioridade
      let multiplicador = 1
      if (item.medida_judicial) multiplicador = 99
      else if (item.prioridade === 'BRE') multiplicador = 1.5
      else if (item.prioridade === 'ONC') multiplicador = 1.3

      const scorePrioridade = diasEspera * multiplicador

      // Formatar telefone
      const telefone = item.pacientes?.DDD_FONE_RESIDENCIAL && item.pacientes?.FONE_RESIDENCIAL
        ? `(${item.pacientes.DDD_FONE_RESIDENCIAL}) ${item.pacientes.FONE_RESIDENCIAL}`
        : item.pacientes?.DDD_FONE_RECADO && item.pacientes?.FONE_RECADO
        ? `(${item.pacientes.DDD_FONE_RECADO}) ${item.pacientes.FONE_RECADO}`
        : undefined

      return {
        id: item.id.toString(),
        pacienteId: item.prontuario.toString(),
        paciente: {
          id: item.prontuario.toString(),
          prontuario: item.prontuario.toString(),
          name: item.pacientes?.NOME_PACIENTE || 'Nome não disponível',
          cpf: undefined,
          birthDate: undefined,
          phone: telefone
        },
        especialidadeId: item.cod_especialidade.toString(),
        especialidade: {
          id: item.cod_especialidade.toString(),
          codigo: item.cod_especialidade.toString(),
          name: item.especialidades?.NOME_ESPECIALIDADE || 'Especialidade não encontrada'
        },
        procedimentoId: item.cod_procedimento.toString(),
        procedimento: {
          id: item.cod_procedimento.toString(),
          codigo: item.cod_procedimento.toString(),
          name: item.procedimentos?.PROCEDIMENTO || 'Procedimento não encontrado',
          especialidadeId: item.cod_especialidade.toString()
        },
        medicoId: item.matricula_medico?.toString() || '',
        medico: {
          id: item.matricula_medico?.toString() || '',
          crm: item.matricula_medico?.toString() || '',
          name: item.profissionais?.NOME_PROFISSIONAL || 'Médico não encontrado',
          especialidades: [item.cod_especialidade.toString()]
        },
        dataEntrada: item.data_entrada.split('T')[0],
        urgencia: item.prioridade === 'BRE',
        oncologico: item.prioridade === 'ONC',
        ordemJudicial: item.medida_judicial,
        observacoes: item.observacoes || undefined,
        diasEspera,
        scorePrioridade,
        posicao: 0, // Será calculado quando necessário
        ativo: item.ativo,
        motivoRemocao: item.motivo_saida || undefined,
        criadoPor: 'sistema',
        criadoEm: item.data_entrada
      } as EntradaLEC
    } catch (err: any) {
      console.error('Erro ao buscar entrada:', err)
      throw new Error(err.message || 'Erro ao carregar entrada')
    }
  }, [])

  // Criar nova entrada
  const createEntrada = useCallback(async (data: {
    prontuario: number
    cod_especialidade: number
    cod_procedimento: number
    matricula_medico?: number
    prioridade: Database['public']['Enums']['prioridade_enum']
    medida_judicial: boolean
    situacao: Database['public']['Enums']['situacao_enum']
    observacoes?: string
    data_novo_contato?: string
  }) => {
    try {
      const { data: result, error: insertError } = await supabase
        .from('lista_espera_cirurgica')
        .insert([data])
        .select('id')
        .single()

      if (insertError) {
        throw new Error(insertError.message)
      }

      return result.id
    } catch (err: any) {
      console.error('Erro ao criar entrada:', err)
      throw new Error(err.message || 'Erro ao criar entrada')
    }
  }, [])

  // Atualizar entrada
  const updateEntrada = useCallback(async (id: string, data: {
    cod_especialidade?: number
    cod_procedimento?: number
    matricula_medico?: number
    prioridade?: Database['public']['Enums']['prioridade_enum']
    medida_judicial?: boolean
    situacao?: Database['public']['Enums']['situacao_enum']
    observacoes?: string
    data_novo_contato?: string
  }) => {
    try {
      const { error: updateError } = await supabase
        .from('lista_espera_cirurgica')
        .update(data)
        .eq('id', parseInt(id))

      if (updateError) {
        throw new Error(updateError.message)
      }
    } catch (err: any) {
      console.error('Erro ao atualizar entrada:', err)
      throw new Error(err.message || 'Erro ao atualizar entrada')
    }
  }, [])

  // Remover entrada (inativar)
  const removeEntrada = useCallback(async (id: string, motivo: Database['public']['Enums']['motivo_saida_enum']) => {
    try {
      const { error: updateError } = await supabase
        .from('lista_espera_cirurgica')
        .update({
          ativo: false,
          motivo_saida: motivo
        })
        .eq('id', parseInt(id))

      if (updateError) {
        throw new Error(updateError.message)
      }
    } catch (err: any) {
      console.error('Erro ao remover entrada:', err)
      throw new Error(err.message || 'Erro ao remover entrada')
    }
  }, [])

  return {
    entradas,
    loading,
    error,
    refetch,
    stats,
    getEntrada,
    createEntrada,
    updateEntrada,
    removeEntrada
  }
}