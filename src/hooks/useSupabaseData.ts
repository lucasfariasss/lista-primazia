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