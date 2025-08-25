import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LECTable } from "@/components/sgfc/LECTable"
import { LECFilters } from "@/components/lec/LECFilters"
import { FilterLEC } from "@/types/sgfc"
import { useListaEsperaCirurgica } from "@/hooks/useSupabaseData"
import { Plus, Search, Download, Users, Clock, AlertTriangle, Gavel } from "lucide-react"
import { toast } from "sonner"

export default function ListaEspera() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<FilterLEC>({
    ativo: true // Por padrão, mostrar apenas ativos
  })

  // Aplicar filtros baseados nos switches para compatibilidade
  const supabaseFilters = useMemo(() => {
    const supaFilters: any = { ...filters }
    
    // Converter filtros booleanos para filtros do banco
    if (filters.oncologico) {
      supaFilters.prioridade = 'ONC'
    } else if (filters.urgencia) {
      supaFilters.prioridade = 'BRE'
    }
    
    // Remover filtros booleanos que foram convertidos
    delete supaFilters.oncologico
    delete supaFilters.urgencia
    delete supaFilters.ordemJudicial
    
    return supaFilters
  }, [filters])

  const { entradas, loading, error } = useListaEsperaCirurgica(supabaseFilters)

  // Filtrar por termo de busca e ordem judicial no frontend
  const entradasFiltradas = useMemo(() => {
    let filtered = entradas

    // Filtro de busca por nome do paciente ou prontuário
    if (searchTerm) {
      filtered = filtered.filter(entrada => 
        entrada.paciente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entrada.paciente.prontuario.includes(searchTerm)
      )
    }

    // Filtro de ordem judicial (aplicado no frontend)
    if (filters.ordemJudicial) {
      filtered = filtered.filter(entrada => entrada.medidaJudicial)
    }

    return filtered
  }, [entradas, searchTerm, filters.ordemJudicial])

  const activeFiltersCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof FilterLEC]
    return value !== undefined && value !== '' && value !== false
  }).length

  const stats = useMemo(() => {
    const total = entradasFiltradas.length
    const urgentes = entradasFiltradas.filter(e => e.urgencia).length
    const oncologicos = entradasFiltradas.filter(e => e.oncologico).length
    const judiciais = entradasFiltradas.filter(e => e.ordemJudicial).length
    const tempoMedio = total > 0 ? 
      Math.round(entradasFiltradas.reduce((acc, e) => acc + e.diasEspera, 0) / total) : 0

    return { total, urgentes, oncologicos, judiciais, tempoMedio }
  }, [entradasFiltradas])

  const handleView = (entrada: any) => {
    navigate(`/lec/entrada/${entrada.id}`)
  }

  const handleEdit = (entrada: any) => {
    navigate(`/lec/entrada/${entrada.id}/editar`)
  }

  const handleRemove = (entrada: any) => {
    toast.info('Funcionalidade de remoção será implementada em breve')
  }

  const handleExport = () => {
    toast.info('Funcionalidade de exportação será implementada em breve')
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-destructive">Erro ao carregar dados: {error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lista de Espera Cirúrgica</h1>
          <p className="text-muted-foreground">
            Gerencie a fila de espera para procedimentos cirúrgicos
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => navigate('/lec/nova-entrada')}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Entrada
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.tempoMedio}</p>
                <p className="text-sm text-muted-foreground">Dias médios</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{stats.urgentes}</p>
                <p className="text-sm text-muted-foreground">Com brevidade</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{stats.oncologicos}</p>
                <p className="text-sm text-muted-foreground">Oncológicos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Gavel className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.judiciais}</p>
                <p className="text-sm text-muted-foreground">Judiciais</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <LECFilters 
        filters={filters}
        onFiltersChange={setFilters}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Busca */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome do paciente ou prontuário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            {searchTerm && (
              <Badge variant="secondary">
                {entradasFiltradas.length} resultado{entradasFiltradas.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Carregando lista de espera...</p>
          </CardContent>
        </Card>
      ) : (
        <LECTable 
          entradas={entradasFiltradas}
          filters={filters}
          onView={handleView}
          onEdit={handleEdit}
          onRemove={handleRemove}
          showActions={true}
          showSensitiveData={true}
        />
      )}
    </div>
  )
}