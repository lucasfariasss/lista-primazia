import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

// Interfaces para os dados das tabelas do Supabase
export interface EspecialidadeDB {
  COD_ESPECIALIDADE: number
  NOME_ESPECIALIDADE: string | null
}

export interface PacienteDB {
  PRONTUARIO_PAC: number
  NOME_PACIENTE: string | null
  FONE_RECADO: string | null
  DDD_FONE_RESIDENCIAL: string | null
  FONE_RESIDENCIAL: string | null
  DDD_FONE_RECADO: string | null
}

export interface ProcedimentoDB {
  COD_PROCEDIMENTO: number
  PROCEDIMENTO: string | null
  COD_ESPECIALIDADE_FK: number | null
}

export interface ProfissionalDB {
  MATRICULA: number
  NOME_PROFISSIONAL: string | null
  PROF_RESPONSAVEL: number | null
}

export interface ListaEsperaCirurgicaDB {
  id: number
  prontuario: number
  cod_procedimento: number
  cod_especialidade: number
  matricula_medico: number | null
  data_entrada: string
  prioridade: 'ONC' | 'BRE' | 'SEM'
  medida_judicial: boolean
  situacao: 'CA' | 'AE' | 'DP' | 'PP' | 'CNR' | 'T1F' | 'T2F' | 'T3F' | 'CRS'
  observacoes: string | null
  data_novo_contato: string | null
  ativo: boolean
  motivo_saida: 'MORTE' | 'OUTRO_LOCAL' | 'AUTOEXCLUSAO' | null
}

// Hook para buscar especialidades
export function useEspecialidades() {
  const [especialidades, setEspecialidades] = useState<EspecialidadeDB[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEspecialidades() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('especialidades')
          .select('*')
          .order('NOME_ESPECIALIDADE')
        
        console.log('Especialidades query result:', { data, error })

        if (error) {
          throw error
        }

        setEspecialidades(data || [])
        setError(null)
      } catch (err) {
        console.error('Erro ao buscar especialidades:', err)
        setError('Erro ao carregar especialidades')
      } finally {
        setLoading(false)
      }
    }

    fetchEspecialidades()
  }, [])

  return { especialidades, loading, error }
}

// Hook para buscar pacientes
export function usePacientes() {
  const [pacientes, setPacientes] = useState<PacienteDB[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPacientes() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('pacientes')
          .select('*')  
          .order('NOME_PACIENTE')
        
        console.log('Pacientes query result:', { data, error })

        if (error) {
          throw error
        }

        setPacientes(data || [])
        setError(null)
      } catch (err) {
        console.error('Erro ao buscar pacientes:', err)
        setError('Erro ao carregar pacientes')
      } finally {
        setLoading(false)
      }
    }

    fetchPacientes()
  }, [])

  return { pacientes, loading, error }
}

// Hook para buscar procedimentos
export function useProcedimentos() {
  const [procedimentos, setProcedimentos] = useState<ProcedimentoDB[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProcedimentos() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('procedimentos')
          .select('*')
          .order('PROCEDIMENTO')
        
        console.log('Procedimentos query result:', { data, error })

        if (error) {
          throw error
        }

        setProcedimentos(data || [])
        setError(null)
      } catch (err) {
        console.error('Erro ao buscar procedimentos:', err)
        setError('Erro ao carregar procedimentos')
      } finally {
        setLoading(false)
      }
    }

    fetchProcedimentos()
  }, [])

  return { procedimentos, loading, error }
}

// Hook para buscar profissionais (médicos)
export function useProfissionais() {
  const [profissionais, setProfissionais] = useState<ProfissionalDB[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProfissionais() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('profissionais')
          .select('*')
          .order('NOME_PROFISSIONAL')
        
        console.log('Profissionais query result:', { data, error })

        if (error) {
          throw error
        }

        setProfissionais(data || [])
        setError(null)
      } catch (err) {
        console.error('Erro ao buscar profissionais:', err)
        setError('Erro ao carregar profissionais')
      } finally {
        setLoading(false)
      }
    }

    fetchProfissionais()
  }, [])

  return { profissionais, loading, error }
}

// Funções utilitárias para converter dados do Supabase para o formato esperado pelos componentes
export const formatEspecialidade = (esp: EspecialidadeDB) => ({
  id: esp.COD_ESPECIALIDADE.toString(),
  nome: esp.NOME_ESPECIALIDADE || '',
  name: esp.NOME_ESPECIALIDADE || '',
  codigo: esp.COD_ESPECIALIDADE.toString(),
  description: `Especialidade médica - Código ${esp.COD_ESPECIALIDADE}`
})

export const formatPaciente = (pac: PacienteDB) => ({
  id: pac.PRONTUARIO_PAC.toString(),
  nome: pac.NOME_PACIENTE || '',
  name: pac.NOME_PACIENTE || '',
  prontuario: pac.PRONTUARIO_PAC.toString(),
  birthDate: '1970-01-01', // Placeholder já que não temos no banco
  cpf: undefined, // Não temos no banco atual
  phone: pac.FONE_RECADO ? `${pac.DDD_FONE_RECADO || ''} ${pac.FONE_RECADO}`.trim() : 
           pac.FONE_RESIDENCIAL ? `${pac.DDD_FONE_RESIDENCIAL || ''} ${pac.FONE_RESIDENCIAL}`.trim() : 
           undefined
})

export const formatProcedimento = (proc: ProcedimentoDB) => ({
  id: proc.COD_PROCEDIMENTO.toString(),
  nome: proc.PROCEDIMENTO || '',
  name: proc.PROCEDIMENTO || '',
  codigo: proc.COD_PROCEDIMENTO.toString(),
  especialidadeId: proc.COD_ESPECIALIDADE_FK?.toString() || '',
  description: `Procedimento cirúrgico - Código ${proc.COD_PROCEDIMENTO}`
})

export const formatProfissional = (prof: ProfissionalDB) => ({
  id: prof.MATRICULA.toString(),
  nome: prof.NOME_PROFISSIONAL || '',
  name: prof.NOME_PROFISSIONAL || '',
  crm: prof.MATRICULA.toString(),
  especialidades: [] // Por enquanto vazio, pois não temos a relação no banco
})

// Hook para buscar lista de espera cirúrgica com JOINs
export function useListaEsperaCirurgica(filters?: {
  especialidadeId?: string
  procedimentoId?: string
  medicoId?: string
  prioridade?: string
  situacao?: string
  ativo?: boolean
}) {
  const [entradas, setEntradas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchListaEspera() {
      try {
        setLoading(true)
        
        // Query com JOINs para buscar dados relacionados
        let query = supabase
          .from('lista_espera_cirurgica')
          .select(`
            *,
            pacientes!inner(PRONTUARIO_PAC, NOME_PACIENTE, FONE_RECADO, DDD_FONE_RECADO, FONE_RESIDENCIAL, DDD_FONE_RESIDENCIAL),
            especialidades!inner(COD_ESPECIALIDADE, NOME_ESPECIALIDADE),
            procedimentos!inner(COD_PROCEDIMENTO, PROCEDIMENTO),
            profissionais(MATRICULA, NOME_PROFISSIONAL)
          `)
          .order('data_entrada', { ascending: true })

        // Aplicar filtros se fornecidos
        if (filters?.especialidadeId) {
          query = query.eq('cod_especialidade', parseInt(filters.especialidadeId))
        }
        if (filters?.procedimentoId) {
          query = query.eq('cod_procedimento', parseInt(filters.procedimentoId))
        }
        if (filters?.medicoId) {
          query = query.eq('matricula_medico', parseInt(filters.medicoId))
        }
        if (filters?.prioridade) {
          query = query.eq('prioridade', filters.prioridade as 'ONC' | 'BRE' | 'SEM')
        }
        if (filters?.situacao) {
          query = query.eq('situacao', filters.situacao as 'CA' | 'AE' | 'DP' | 'PP' | 'CNR' | 'T1F' | 'T2F' | 'T3F' | 'CRS')
        }
        if (filters?.ativo !== undefined) {
          query = query.eq('ativo', filters.ativo)
        }

        const { data, error } = await query

        console.log('Lista espera query result:', { data, error })

        if (error) {
          throw error
        }

        // Formatar dados para o formato esperado pelos componentes
        const entradasFormatadas = (data || []).map((entrada, index) => ({
          id: entrada.id.toString(),
          pacienteId: entrada.prontuario.toString(),
          paciente: {
            id: entrada.prontuario.toString(),
            prontuario: entrada.prontuario.toString(),
            name: entrada.pacientes.NOME_PACIENTE || '',
            birthDate: '1970-01-01', // Placeholder
            phone: entrada.pacientes.FONE_RECADO ? 
              `${entrada.pacientes.DDD_FONE_RECADO || ''} ${entrada.pacientes.FONE_RECADO}`.trim() : 
              entrada.pacientes.FONE_RESIDENCIAL ? 
              `${entrada.pacientes.DDD_FONE_RESIDENCIAL || ''} ${entrada.pacientes.FONE_RESIDENCIAL}`.trim() : 
              undefined
          },
          especialidadeId: entrada.cod_especialidade.toString(),
          especialidade: {
            id: entrada.cod_especialidade.toString(),
            codigo: entrada.cod_especialidade.toString(),
            name: entrada.especialidades.NOME_ESPECIALIDADE || ''
          },
          procedimentoId: entrada.cod_procedimento.toString(),
          procedimento: {
            id: entrada.cod_procedimento.toString(),
            codigo: entrada.cod_procedimento.toString(),
            name: entrada.procedimentos.PROCEDIMENTO || '',
            especialidadeId: entrada.cod_especialidade.toString()
          },
          medicoId: entrada.matricula_medico?.toString() || '',
          medico: entrada.profissionais ? {
            id: entrada.matricula_medico?.toString() || '',
            crm: entrada.matricula_medico?.toString() || '',
            name: entrada.profissionais.NOME_PROFISSIONAL || '',
            especialidades: []
          } : {
            id: '',
            crm: '',
            name: 'Não informado',
            especialidades: []
          },
          dataEntrada: entrada.data_entrada,
          prioridade: entrada.prioridade,
          medidaJudicial: entrada.medida_judicial,
          situacao: entrada.situacao,
          observacoes: entrada.observacoes,
          dataNovoContato: entrada.data_novo_contato,
          ativo: entrada.ativo,
          motivoSaida: entrada.motivo_saida,
          
          // Campos calculados
          diasEspera: Math.floor((new Date().getTime() - new Date(entrada.data_entrada).getTime()) / (1000 * 60 * 60 * 24)),
          urgencia: entrada.prioridade === 'BRE',
          oncologico: entrada.prioridade === 'ONC',
          ordemJudicial: entrada.medida_judicial,
          scorePrioridade: calculatePriorityScore(entrada),
          posicao: index + 1
        }))

        setEntradas(entradasFormatadas)
        setError(null)
      } catch (err) {
        console.error('Erro ao buscar lista de espera:', err)
        setError('Erro ao carregar lista de espera')
      } finally {
        setLoading(false)
      }
    }

    fetchListaEspera()
  }, [filters])

  return { entradas, loading, error, refetch: () => setLoading(true) }
}

// Função auxiliar para calcular score de prioridade
function calculatePriorityScore(entrada: any): number {
  const diasEspera = Math.floor((new Date().getTime() - new Date(entrada.data_entrada).getTime()) / (1000 * 60 * 60 * 24))
  let score = diasEspera

  // Multiplicadores de prioridade
  if (entrada.prioridade === 'ONC') score *= 3 // Oncológico
  else if (entrada.prioridade === 'BRE') score *= 2 // Com brevidade
  
  if (entrada.medida_judicial) score *= 1.5 // Ordem judicial

  return Math.round(score)
}