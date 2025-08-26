import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LECTable } from "@/components/sgfc/LECTable"
import { EntradaLEC, FilterLEC } from "@/types/sgfc"
import { useListaEsperaCirurgica } from "@/hooks/useListaEsperaCirurgica"
import { Plus, Filter, Download, Users, Clock, AlertTriangle, Scale, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"

export default function Dashboard() {
  const [filters, setFilters] = useState<FilterLEC>({})
  const { entradas, loading, error, refetch, stats, removeEntrada } = useListaEsperaCirurgica(filters)

  const navigate = useNavigate()
  const { toast } = useToast()

  const [showFilters, setShowFilters] = useState(false)
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
  const [selectedEntrada, setSelectedEntrada] = useState<EntradaLEC | null>(null)
  const [motivoSaida, setMotivoSaida] = useState<string>("")
  const [removing, setRemoving] = useState(false)

  const handleEdit = (entrada: EntradaLEC) => {
    navigate(`/lec/${entrada.id}/editar`)
  }

  const handleRemove = (entrada: EntradaLEC) => {
    setSelectedEntrada(entrada)
    setMotivoSaida("")
    setRemoveDialogOpen(true)
  }

  const handleView = (entrada: EntradaLEC) => {
    navigate(`/lec/${entrada.id}`)
  }

  const confirmRemove = async () => {
    if (!selectedEntrada) return
    if (!motivoSaida) {
      toast({ title: "Selecione o motivo", description: "Informe o motivo da saída.", variant: "destructive" })
      return
    }

    try {
      setRemoving(true)
      await removeEntrada(selectedEntrada.id, motivoSaida as any)
      toast({ title: "Removido da fila", description: `Paciente ${selectedEntrada.paciente.prontuario} marcado como inativo.` })
      setRemoveDialogOpen(false)
      setSelectedEntrada(null)
      setMotivoSaida("")
      refetch()
    } catch (err: any) {
      toast({ title: "Erro ao remover", description: err.message || "Tente novamente.", variant: "destructive" })
    } finally {
      setRemoving(false)
    }
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
          <Button variant="outline" onClick={() => setShowFilters((v) => !v)}>
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="medical" onClick={() => navigate("/lec/nova") }>
            <Plus className="h-4 w-4 mr-2" />
            Nova Entrada
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Refine a lista em tempo real</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-3 rounded-md border">
              <Label htmlFor="f-urg">Urgência</Label>
              <Switch id="f-urg" checked={!!filters.urgencia} onCheckedChange={(v) => setFilters(f => ({ ...f, urgencia: v }))} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-md border">
              <Label htmlFor="f-onc">Oncológico</Label>
              <Switch id="f-onc" checked={!!filters.oncologico} onCheckedChange={(v) => setFilters(f => ({ ...f, oncologico: v }))} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-md border">
              <Label htmlFor="f-jud">Judicial</Label>
              <Switch id="f-jud" checked={!!filters.ordemJudicial} onCheckedChange={(v) => setFilters(f => ({ ...f, ordemJudicial: v }))} />
            </div>
            <div className="grid gap-2">
              <Label>Período (início)</Label>
              <Input type="date" value={filters.dataInicio || ''} onChange={(e) => setFilters(f => ({ ...f, dataInicio: e.target.value || undefined }))} />
            </div>
            <div className="grid gap-2">
              <Label>Período (fim)</Label>
              <Input type="date" value={filters.dataFim || ''} onChange={(e) => setFilters(f => ({ ...f, dataFim: e.target.value || undefined }))} />
            </div>
            <div className="md:col-span-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setFilters({})}>Limpar</Button>
              <Button variant="ghost" onClick={() => setShowFilters(false)}>Fechar</Button>
            </div>
          </CardContent>
        </Card>
      )}

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

      {/* Dialog de remoção */}
      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover da Fila</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação marcará a entrada como inativa. Selecione o motivo da saída.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Motivo da saída</Label>
              <Select value={motivoSaida} onValueChange={setMotivoSaida}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="z-50">
                  <SelectItem value="CIR">Cirurgia realizada</SelectItem>
                  <SelectItem value="OBI">Óbito</SelectItem>
                  <SelectItem value="OUT">Cirurgia em outro local</SelectItem>
                  <SelectItem value="AUT">Autoexclusão do paciente</SelectItem>
                  <SelectItem value="CON">Contraindicação médica</SelectItem>
                  <SelectItem value="NAO">Não comparecimento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setRemoveDialogOpen(false)} disabled={removing}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmRemove} disabled={removing}>
              {removing ? "Removendo..." : "Confirmar remoção"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}