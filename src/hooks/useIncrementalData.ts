import { useState, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'

export interface SearchResultItem {
  id: string
  name: string
  codigo?: string
  description?: string
}

export interface SearchResult {
  items: SearchResultItem[]
  hasMore: boolean
  loading: boolean
  error: string | null
}

export interface PacienteValidation {
  isValid: boolean
  paciente: {
    id: string
    nome: string
    prontuario: string
    phone?: string
  } | null
  loading: boolean
  error: string | null
}

const ITEMS_PER_PAGE = 20

// Hook para busca incremental de especialidades
export function useEspecialidadesSearch() {
  const [result, setResult] = useState<SearchResult>({
    items: [],
    hasMore: false,
    loading: false,
    error: null
  })

  const searchEspecialidades = useCallback(async (
    query: string = '',
    page: number = 0,
    reset: boolean = true
  ) => {
    if (query.length > 0 && query.length < 2) return

    try {
      setResult(prev => ({ ...prev, loading: true, error: null }))

      let queryBuilder = supabase
        .from('especialidades')
        .select('*')
        .order('NOME_ESPECIALIDADE')

      if (query) {
        queryBuilder = queryBuilder.ilike('NOME_ESPECIALIDADE', `%${query}%`)
      }

      const from = page * ITEMS_PER_PAGE
      const to = from + ITEMS_PER_PAGE - 1

      const { data, error, count } = await queryBuilder
        .range(from, to)
        .limit(ITEMS_PER_PAGE)

      if (error) throw error

      const formattedData = (data || []).map(item => ({
        id: item.COD_ESPECIALIDADE.toString(),
        name: item.NOME_ESPECIALIDADE || '',
        codigo: item.COD_ESPECIALIDADE.toString(),
        description: `Especialidade médica - Código ${item.COD_ESPECIALIDADE}`
      }))

      const hasMore = count ? count > (page + 1) * ITEMS_PER_PAGE : false

      setResult(prev => ({
        items: reset ? formattedData : [...prev.items, ...formattedData],
        hasMore,
        loading: false,
        error: null
      }))
    } catch (err: any) {
      setResult(prev => ({
        ...prev,
        loading: false,
        error: err.message || 'Erro ao buscar especialidades'
      }))
    }
  }, [])

  return { result, searchEspecialidades }
}

// Hook para busca incremental de procedimentos
export function useProcedimentosSearch() {
  const [result, setResult] = useState<SearchResult>({
    items: [],
    hasMore: false,
    loading: false,
    error: null
  })

  const searchProcedimentos = useCallback(async (
    query: string = '',
    especialidadeId: string = '',
    page: number = 0,
    reset: boolean = true
  ) => {
    if (query.length > 0 && query.length < 2) return
    if (!especialidadeId) {
      setResult({ items: [], hasMore: false, loading: false, error: null })
      return
    }

    try {
      setResult(prev => ({ ...prev, loading: true, error: null }))

      let queryBuilder = supabase
        .from('procedimentos')
        .select('*')
        .eq('cod_especialidade_fk', Number(especialidadeId))
        .order('PROCEDIMENTO')

      if (query) {
        queryBuilder = queryBuilder.ilike('PROCEDIMENTO', `%${query}%`)
      }

      const from = page * ITEMS_PER_PAGE
      const to = from + ITEMS_PER_PAGE - 1

      const { data, error, count } = await queryBuilder
        .range(from, to)
        .limit(ITEMS_PER_PAGE)

      if (error) throw error

      const formattedData = (data || []).map(item => ({
        id: item.COD_PROCEDIMENTO.toString(),
        name: item.PROCEDIMENTO || '',
        codigo: item.COD_PROCEDIMENTO.toString(),
        description: `Procedimento cirúrgico - Código ${item.COD_PROCEDIMENTO}`
      }))

      const hasMore = count ? count > (page + 1) * ITEMS_PER_PAGE : false

      setResult({
        items: reset ? formattedData : [...result.items, ...formattedData],
        hasMore,
        loading: false,
        error: null
      })
    } catch (err: any) {
      setResult({
        items: [],
        hasMore: false,
        loading: false,
        error: err.message || 'Erro ao buscar procedimentos'
      })
    }
  }, [result.items])

  return { result, searchProcedimentos }
}

// Hook para busca incremental de profissionais
export function useProfissionaisSearch() {
  const [result, setResult] = useState<SearchResult>({
    items: [],
    hasMore: false,
    loading: false,
    error: null
  })

  const searchProfissionais = useCallback(async (
    query: string = '',
    page: number = 0,
    reset: boolean = true
  ) => {
    if (query.length > 0 && query.length < 2) return

    try {
      setResult(prev => ({ ...prev, loading: true, error: null }))

      let queryBuilder = supabase
        .from('profissionais')
        .select('*')
        .order('NOME_PROFISSIONAL')

      if (query) {
        queryBuilder = queryBuilder.ilike('NOME_PROFISSIONAL', `%${query}%`)
      }

      const from = page * ITEMS_PER_PAGE
      const to = from + ITEMS_PER_PAGE - 1

      const { data, error, count } = await queryBuilder
        .range(from, to)
        .limit(ITEMS_PER_PAGE)

      if (error) throw error

      const formattedData = (data || []).map(item => ({
        id: item.MATRICULA.toString(),
        name: item.NOME_PROFISSIONAL || '',
        codigo: item.MATRICULA.toString(),
        description: `CRM ${item.MATRICULA}`
      }))

      const hasMore = count ? count > (page + 1) * ITEMS_PER_PAGE : false

      setResult(prev => ({
        items: reset ? formattedData : [...prev.items, ...formattedData],
        hasMore,
        loading: false,
        error: null
      }))
    } catch (err: any) {
      setResult(prev => ({
        ...prev,
        loading: false,
        error: err.message || 'Erro ao buscar profissionais'
      }))
    }
  }, [])

  return { result, searchProfissionais }
}

// Hook para validação de prontuário
export function useProntuarioValidation() {
  const [result, setResult] = useState<PacienteValidation>({
    isValid: false,
    paciente: null,
    loading: false,
    error: null
  })

  const validateProntuario = useCallback(async (prontuario: string) => {
    if (!prontuario.trim()) {
      setResult({
        isValid: false,
        paciente: null,
        loading: false,
        error: null
      })
      return
    }

    try {
      setResult(prev => ({ ...prev, loading: true, error: null }))

      const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .eq('prontuario_pac', Number(prontuario))
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setResult({
          isValid: true,
          paciente: {
            id: data.PRONTUARIO_PAC.toString(),
            nome: data.NOME_PACIENTE || '',
            prontuario: data.PRONTUARIO_PAC.toString(),
            phone: data.FONE_RECADO ? `${data.DDD_FONE_RECADO || ''} ${data.FONE_RECADO}`.trim() : undefined
          },
          loading: false,
          error: null
        })
      } else {
        setResult({
          isValid: false,
          paciente: null,
          loading: false,
          error: 'Prontuário não encontrado'
        })
      }
    } catch (err: any) {
      setResult({
        isValid: false,
        paciente: null,
        loading: false,
        error: err.message || 'Erro ao validar prontuário'
      })
    }
  }, [])

  const clearValidation = useCallback(() => {
    setResult({
      isValid: false,
      paciente: null,
      loading: false,
      error: null
    })
  }, [])

  return { result, validateProntuario, clearValidation }
}