import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useListaEsperaCirurgica } from "@/hooks/useListaEsperaCirurgica"
import { EntradaLEC } from "@/types/sgfc"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  User, 
  Stethoscope, 
  Activity, 
  Calendar,
  Clock,
  Scale,
  Heart,
  AlertCircle,
  UserCheck,
  CheckCircle,
  XCircle
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"


const motivosSaida = [
  { value: "CIR", label: "Cirurgia realizada" },
  { value: "OBI", label: "Óbito" },
  { value: "OUT", label: "Cirurgia em outro local" },
  { value: "AUT", label: "Autoexclusão do paciente" },
  { value: "CON", label: "Contraindicação médica" },
  { value: "NAO", label: "Não comparecimento" }
]

export default function VerEntrada() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { getEntrada, removeEntrada } = useListaEsperaCirurgica()
  
  const [entrada, setEntrada] = useState<EntradaLEC | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showRemoverDialog, setShowRemoverDialog] = useState(false)
  const [remocaoData, setRemocaoData] = useState({
    motivoSaida: "",
    changeReason: ""
  })
  const [removendo, setRemovendo] = useState(false)

  useEffect(() => {
    const carregarEntrada = async () => {
      if (!id) return
      
      try {
        setLoading(true)
        setError(null)
        const entradaData = await getEntrada(id)
        setEntrada(entradaData)
      } catch (err: any) {
        console.error('Erro ao carregar entrada:', err)
        setError(err.message || 'Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }

    carregarEntrada()
  }, [id, getEntrada])

  const getPrioridadeInfo = (entrada: EntradaLEC) => {
    if (entrada.oncologico) {
      return { label: "Oncológico", variant: "oncology" as const, icon: Heart }
    }
    if (entrada.urgencia) {
      return { label: "Com Brevidade", variant: "urgent" as const, icon: AlertCircle }
    }
    return { label: "Sem Brevidade", variant: "secondary" as const, icon: Clock }
  }

  const handleRemoverDaFila = async () => {
    if (!remocaoData.motivoSaida || !remocaoData.changeReason.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione o motivo da saída e informe a justificativa.",
        variant: "destructive"
      })
      return
    }

    if (!id) return

    setRemovendo(true)

    try {
      await removeEntrada(id, remocaoData.motivoSaida as any)

      toast({
        title: "Paciente removido da fila",
        description: "A entrada foi marcada como inativa com sucesso."
      })

      // Atualizar entrada localmente
      setEntrada(prev => prev ? { ...prev, ativo: false } : null)
      setShowRemoverDialog(false)
      setRemocaoData({ motivoSaida: "", changeReason: "" })
    } catch (error: any) {
      toast({
        title: "Erro ao remover",
        description: error.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setRemovendo(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid gap-6">
            <div className="h-48 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !entrada) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">
          {error ? "Erro ao carregar entrada" : "Entrada não encontrada"}
        </h2>
        <p className="text-muted-foreground mb-4">
          {error || "A entrada solicitada não foi encontrada ou você não tem permissão para visualizá-la."}
        </p>
        <Button onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Dashboard
        </Button>
      </div>
    )
  }

  const prioridadeInfo = getPrioridadeInfo(entrada)
  const PrioridadeIcon = prioridadeInfo.icon

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Entrada na LEC</h1>
            <p className="text-muted-foreground">
              Prontuário: {entrada.paciente.prontuario} • ID: {entrada.id}
            </p>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-2">
          <Badge variant={entrada.ativo ? "default" : "secondary"}>
            {entrada.ativo ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Ativo
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3 mr-1" />
                Inativo
              </>
            )}
          </Badge>
          
          <Badge variant={prioridadeInfo.variant}>
            <PrioridadeIcon className="h-3 w-3 mr-1" />
            {prioridadeInfo.label}
          </Badge>
          
          {entrada.ordemJudicial && (
            <Badge variant="outline" className="border-amber-500 text-amber-700">
              <Scale className="h-3 w-3 mr-1" />
              Judicial
            </Badge>
          )}
        </div>
      </div>

      {/* Ações */}
      <div className="flex gap-4">
        <Button asChild>
          <Link to={`/lec/${entrada.id}/editar`}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Link>
        </Button>
        
        {entrada.ativo && (
          <Button 
            variant="destructive" 
            onClick={() => setShowRemoverDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remover da Fila
          </Button>
        )}
      </div>

      {/* Informações Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vínculos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Vínculos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Paciente</Label>
              <p className="font-medium">{entrada.paciente.name}</p>
              <p className="text-sm text-muted-foreground">Prontuário: {entrada.paciente.prontuario}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Especialidade</Label>
              <p className="font-medium">{entrada.especialidade.name}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Procedimento</Label>
              <p className="font-medium">{entrada.procedimento.name}</p>
            </div>
            
            {entrada.medico.name && entrada.medico.name !== 'Médico não encontrado' && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Médico</Label>
                <p className="font-medium">{entrada.medico.name}</p>
                <p className="text-sm text-muted-foreground">CRM: {entrada.medico.crm}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status da Fila */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Status da Fila
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {entrada.posicao > 0 && (
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <p className="text-3xl font-bold text-primary">#{entrada.posicao}</p>
                <p className="text-sm text-muted-foreground">Posição atual</p>
              </div>
            )}
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Dias de espera</Label>
              <Badge variant={entrada.diasEspera > 90 ? "destructive" : "secondary"} className="mt-1">
                {entrada.diasEspera} dias
              </Badge>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Data de entrada</Label>
              <p className="font-medium">
                {format(new Date(entrada.dataEntrada), "PPP", { locale: ptBR })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Dados Complementares */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Complementares
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {entrada.observacoes && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Observações</Label>
                <p className="text-sm bg-muted/50 p-3 rounded-md">{entrada.observacoes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Auditoria */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Histórico de Auditoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-2 border-primary pl-4">
              <p className="font-medium text-primary">Entrada criada</p>
              <p className="text-sm text-muted-foreground">
                Por: {entrada.criadoPor} • {format(new Date(entrada.criadoEm), "PPP 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
            
            {entrada.atualizadoPor && entrada.atualizadoEm && (
              <div className="border-l-2 border-muted pl-4">
                <p className="font-medium">Última atualização</p>
                <p className="text-sm text-muted-foreground">
                  Por: {entrada.atualizadoPor} • {format(new Date(entrada.atualizadoEm), "PPP 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Remoção */}
      <Dialog open={showRemoverDialog} onOpenChange={setShowRemoverDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover da Fila</DialogTitle>
            <DialogDescription>
              Esta ação marcará a entrada como inativa. Informe o motivo da remoção.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Motivo da saída *</Label>
              <Select 
                value={remocaoData.motivoSaida} 
                onValueChange={(value) => setRemocaoData(prev => ({ ...prev, motivoSaida: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o motivo" />
                </SelectTrigger>
                <SelectContent>
                  {motivosSaida.map(motivo => (
                    <SelectItem key={motivo.value} value={motivo.value}>
                      {motivo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Justificativa *</Label>
              <Textarea
                placeholder="Descreva o motivo da remoção desta entrada da fila"
                value={remocaoData.changeReason}
                onChange={(e) => setRemocaoData(prev => ({ ...prev, changeReason: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowRemoverDialog(false)}
              disabled={removendo}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRemoverDaFila}
              disabled={removendo}
            >
              {removendo ? "Removendo..." : "Remover da Fila"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}