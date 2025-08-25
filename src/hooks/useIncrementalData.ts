import { useState, useCallback } from 'react'
import { useEspecialidades, usePacientes, useProcedimentos, useProfissionais, formatEspecialidade, formatPaciente, formatProcedimento, formatProfissional } from './useSupabaseData'

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
  const { especialidades: allEspecialidades, loading: initialLoading, error: initialError } = useEspecialidades()
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
      setResult(prev => ({ ...prev, loading: true, error: initialError }))

      if (initialError) {
        setResult(prev => ({ ...prev, loading: false, error: initialError }))
        return
      }

      // Simular debounce
      await new Promise(resolve => setTimeout(resolve, 300))

      const formattedEspecialidades = allEspecialidades.map(formatEspecialidade)
      
      // Filtrar por query se fornecida
      const filteredEspecialidades = query 
        ? formattedEspecialidades.filter(esp => 
            esp.name.toLowerCase().includes(query.toLowerCase())
          )
        : formattedEspecialidades

      // Aplicar paginação
      const from = page * ITEMS_PER_PAGE
      const to = from + ITEMS_PER_PAGE
      const pageData = filteredEspecialidades.slice(from, to)
      const hasMore = to < filteredEspecialidades.length

      setResult(prev => ({
        items: reset ? pageData : [...prev.items, ...pageData],
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
  }, [allEspecialidades, initialError])

  return { result, searchEspecialidades }
}

// Hook para busca incremental de procedimentos
export function useProcedimentosSearch() {
  const { procedimentos: allProcedimentos, loading: initialLoading, error: initialError } = useProcedimentos()
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
      setResult(prev => ({ ...prev, loading: true, error: initialError }))

      if (initialError) {
        setResult(prev => ({ ...prev, loading: false, error: initialError }))
        return
      }

      // Simular debounce
      await new Promise(resolve => setTimeout(resolve, 300))

      const formattedProcedimentos = allProcedimentos.map(formatProcedimento)
      
      // Filtrar por especialidade e query
      let filteredProcedimentos = formattedProcedimentos.filter(proc => 
        proc.especialidadeId === especialidadeId
      )

      if (query) {
        filteredProcedimentos = filteredProcedimentos.filter(proc =>
          proc.name.toLowerCase().includes(query.toLowerCase())
        )
      }

      // Aplicar paginação
      const from = page * ITEMS_PER_PAGE
      const to = from + ITEMS_PER_PAGE
      const pageData = filteredProcedimentos.slice(from, to)
      const hasMore = to < filteredProcedimentos.length

      setResult(prev => ({
        items: reset ? pageData : [...prev.items, ...pageData],
        hasMore,
        loading: false,
        error: null
      }))
    } catch (err: any) {
      setResult({
        items: [],
        hasMore: false,
        loading: false,
        error: err.message || 'Erro ao buscar procedimentos'
      })
    }
  }, [allProcedimentos, initialError])

  return { result, searchProcedimentos }
}

// Hook para busca incremental de profissionais
export function useProfissionaisSearch() {
  const { profissionais: allProfissionais, loading: initialLoading, error: initialError } = useProfissionais()
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
      setResult(prev => ({ ...prev, loading: true, error: initialError }))

      if (initialError) {
        setResult(prev => ({ ...prev, loading: false, error: initialError }))
        return
      }

      // Simular debounce
      await new Promise(resolve => setTimeout(resolve, 300))

      const formattedProfissionais = allProfissionais.map(formatProfissional)
      
      // Filtrar por query se fornecida
      const filteredProfissionais = query 
        ? formattedProfissionais.filter(prof => 
            prof.name.toLowerCase().includes(query.toLowerCase())
          )
        : formattedProfissionais

      // Aplicar paginação
      const from = page * ITEMS_PER_PAGE
      const to = from + ITEMS_PER_PAGE
      const pageData = filteredProfissionais.slice(from, to)
      const hasMore = to < filteredProfissionais.length

      setResult(prev => ({
        items: reset ? pageData : [...prev.items, ...pageData],
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
  }, [allProfissionais, initialError])

  return { result, searchProfissionais }
}

// Hook para validação de prontuário
export function useProntuarioValidation() {
  const { pacientes: allPacientes } = usePacientes()
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

    setResult(prev => ({ ...prev, loading: true, error: null }))

    try {
      // Simular busca no banco
      await new Promise(resolve => setTimeout(resolve, 500))

      const pacienteEncontrado = allPacientes.find(pac => 
        pac.PRONTUARIO_PAC.toString() === prontuario
      )

      if (pacienteEncontrado) {
        const formattedPaciente = formatPaciente(pacienteEncontrado)
        
        setResult({
          isValid: true,
          paciente: {
            id: formattedPaciente.id,
            nome: formattedPaciente.nome,
            prontuario: formattedPaciente.prontuario,
            phone: formattedPaciente.phone
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
  }, [allPacientes])

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