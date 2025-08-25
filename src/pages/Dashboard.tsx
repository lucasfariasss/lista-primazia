import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LECTable } from "@/components/sgfc/LECTable"
import { EntradaLEC, FilterLEC } from "@/types/sgfc"
import { useListaEsperaCirurgica } from "@/hooks/useListaEsperaCirurgica"
import { Plus, Filter, Download, Users, Clock, AlertTriangle, Scale } from "lucide-react"

export default function Dashboard() {
  const [filters, setFilters] = useState<FilterLEC>({})
  const { entradas, loading, error, refetch, stats } = useListaEsperaCirurgica(filters)

  const handleEdit = (entrada: EntradaLEC) => {
    console.log("Edit entrada:", entrada.id)
    // TODO: Implementar navegação para edição
  }

  const handleRemove = (entrada: EntradaLEC) => {
    console.log("Remove entrada:", entrada.id)
    // TODO: Implementar modal de confirmação
  }

  const handleView = (entrada: EntradaLEC) => {
    console.log("View entrada:", entrada.id)
    // TODO: Implementar modal de detalhes
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Carregando lista de espera...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">Erro: {error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lista de Espera Cirúrgica</h1>
          <p className="text-muted-foreground mt-2">
            Gestão centralizada da fila cirúrgica com priorização automática
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="medical">
            <Plus className="h-4 w-4 mr-2" />
            Nova Entrada
          </Button>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalPacientes}</div>
            <p className="text-xs text-muted-foreground">
              Na fila de espera cirúrgica
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.tempoMedioEspera}</div>
            <p className="text-xs text-muted-foreground">
              Dias de espera média
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Casos Urgentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-urgent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-urgent">{stats.pacientesUrgentes}</div>
            <p className="text-xs text-muted-foreground">
              Requerem atenção prioritária
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ordem Judicial</CardTitle>
            <Scale className="h-4 w-4 text-legal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-legal">{stats.pacientesJudiciais}</div>
            <p className="text-xs text-muted-foreground">
              Com determinação judicial
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela principal */}
      <LECTable
        entradas={entradas}
        filters={filters}
        onEdit={handleEdit}
        onRemove={handleRemove}
        onView={handleView}
        showActions={true}
        showSensitiveData={true}
      />
    </div>
  )
}