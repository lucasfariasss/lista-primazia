import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Save, ArrowLeft, User, Stethoscope, Activity, UserCheck } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

// Mock data para autocompletes
const mockEspecialidades = [
  { id: "e1", nome: "Ortopedia", codigo: "ORTOP" },
  { id: "e2", nome: "Cirurgia Geral", codigo: "CIRGE" },
  { id: "e3", nome: "Oncologia", codigo: "ONCOL" },
  { id: "e4", nome: "Cardiologia", codigo: "CARDI" }
]

const mockProcedimentos = [
  { id: "p1", nome: "Artroplastia total do joelho", codigo: "40816015", especialidadeId: "e1" },
  { id: "p2", nome: "Artroscopia de joelho", codigo: "40816020", especialidadeId: "e1" },
  { id: "p3", nome: "Colecistectomia por videolaparoscopia", codigo: "40601070", especialidadeId: "e2" },
  { id: "p4", nome: "Herniorrafia inguinal", codigo: "40601030", especialidadeId: "e2" },
  { id: "p5", nome: "Ressecção de tumor colorretal", codigo: "40901070", especialidadeId: "e3" },
  { id: "p6", nome: "Revascularização do miocárdio", codigo: "40701020", especialidadeId: "e4" }
]

const mockPacientes = [
  { id: "pac1", nome: "João Silva Santos", prontuario: "001234", cpf: "123.456.789-00" },
  { id: "pac2", nome: "Maria Oliveira Costa", prontuario: "005678", cpf: "987.654.321-00" },
  { id: "pac3", nome: "Carlos Eduardo Lima", prontuario: "009876", cpf: "456.789.123-00" }
]

const mockMedicos = [
  { id: "med1", nome: "Dr. João Oliveira", crm: "12345", especialidades: ["e1"] },
  { id: "med2", nome: "Dra. Maria Santos", crm: "23456", especialidades: ["e2"] },
  { id: "med3", nome: "Dr. Carlos Lima", crm: "34567", especialidades: ["e4"] },
  { id: "med4", nome: "Dra. Ana Costa", crm: "45678", especialidades: ["e3"] }
]

const situacoes = [
  { value: "CA", label: "Consulta Agendada" },
  { value: "EP", label: "Exames Pendentes" },
  { value: "DP", label: "Documentos Pendentes" },
  { value: "PP", label: "Paciente Pronto para Cirurgia" },
  { value: "AE", label: "Aguardando Exames" },
  { value: "AS", label: "Aguardando Segunda Opinião" }
]

interface FormData {
  especialidadeId: string
  procedimentoId: string
  pacienteId: string
  medicoId: string
  prioridade: "ONC" | "BRE" | "SEM"
  medidaJudicial: boolean
  situacao: string
  observacoes: string
  dataNovoContato: Date | undefined
  motivoAlteracao: string
}

export default function NovaEntrada() {
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState<FormData>({
    especialidadeId: "",
    procedimentoId: "",
    pacienteId: "",
    medicoId: "",
    prioridade: "SEM",
    medidaJudicial: false,
    situacao: "",
    observacoes: "",
    dataNovoContato: undefined,
    motivoAlteracao: ""
  })
  
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Filtrar procedimentos pela especialidade selecionada
  const procedimentosFiltrados = mockProcedimentos.filter(
    proc => proc.especialidadeId === formData.especialidadeId
  )

  // Validação do formulário
  const validarFormulario = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.especialidadeId) newErrors.especialidadeId = "Especialidade é obrigatória"
    if (!formData.procedimentoId) newErrors.procedimentoId = "Procedimento é obrigatório"
    if (!formData.pacienteId) newErrors.pacienteId = "Paciente é obrigatório"
    if (!formData.situacao) newErrors.situacao = "Situação é obrigatória"
    if (!formData.motivoAlteracao.trim()) newErrors.motivoAlteracao = "Motivo da alteração é obrigatório"

    // Validar se procedimento é compatível com especialidade
    if (formData.especialidadeId && formData.procedimentoId) {
      const procedimento = mockProcedimentos.find(p => p.id === formData.procedimentoId)
      if (procedimento && procedimento.especialidadeId !== formData.especialidadeId) {
        newErrors.procedimentoId = "Procedimento não é compatível com a especialidade selecionada"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validarFormulario()) {
      return
    }

    setLoading(true)

    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "Entrada criada com sucesso",
        description: "A nova entrada foi adicionada à Lista de Espera Cirúrgica."
      })

      // Redirecionar para o detalhe (simulado)
      navigate(`/lec/123`, { replace: true })
    } catch (error) {
      toast({
        title: "Erro ao criar entrada",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEspecialidadeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      especialidadeId: value,
      procedimentoId: "" // Limpar procedimento ao trocar especialidade
    }))
    setErrors(prev => ({ ...prev, especialidadeId: "", procedimentoId: "" }))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nova Entrada na LEC</h1>
          <p className="text-muted-foreground">
            Cadastrar novo paciente na Lista de Espera Cirúrgica
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vínculos (Catálogos) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Vínculos com Catálogos
            </CardTitle>
            <CardDescription>
              Selecione os dados vindos do sistema hospitalar (somente leitura)
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Especialidade */}
            <div className="space-y-2">
              <Label htmlFor="especialidade">Especialidade *</Label>
              <Select 
                value={formData.especialidadeId} 
                onValueChange={handleEspecialidadeChange}
              >
                <SelectTrigger className={errors.especialidadeId ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecione a especialidade" />
                </SelectTrigger>
                <SelectContent>
                  {mockEspecialidades.map(esp => (
                    <SelectItem key={esp.id} value={esp.id}>
                      {esp.nome} ({esp.codigo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.especialidadeId && (
                <p className="text-sm text-destructive">{errors.especialidadeId}</p>
              )}
            </div>

            {/* Procedimento */}
            <div className="space-y-2">
              <Label htmlFor="procedimento">Procedimento *</Label>
              <Select 
                value={formData.procedimentoId} 
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, procedimentoId: value }))
                  setErrors(prev => ({ ...prev, procedimentoId: "" }))
                }}
                disabled={!formData.especialidadeId}
              >
                <SelectTrigger className={errors.procedimentoId ? "border-destructive" : ""}>
                  <SelectValue placeholder={
                    formData.especialidadeId 
                      ? "Selecione o procedimento" 
                      : "Primeiro selecione uma especialidade"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {procedimentosFiltrados.map(proc => (
                    <SelectItem key={proc.id} value={proc.id}>
                      {proc.nome} ({proc.codigo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.procedimentoId && (
                <p className="text-sm text-destructive">{errors.procedimentoId}</p>
              )}
            </div>

            {/* Paciente */}
            <div className="space-y-2">
              <Label htmlFor="paciente">Paciente *</Label>
              <Select 
                value={formData.pacienteId} 
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, pacienteId: value }))
                  setErrors(prev => ({ ...prev, pacienteId: "" }))
                }}
              >
                <SelectTrigger className={errors.pacienteId ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecione o paciente" />
                </SelectTrigger>
                <SelectContent>
                  {mockPacientes.map(pac => (
                    <SelectItem key={pac.id} value={pac.id}>
                      {pac.nome} - {pac.prontuario}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.pacienteId && (
                <p className="text-sm text-destructive">{errors.pacienteId}</p>
              )}
            </div>

            {/* Médico */}
            <div className="space-y-2">
              <Label htmlFor="medico">Médico (Opcional)</Label>
              <Select 
                value={formData.medicoId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, medicoId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o médico responsável" />
                </SelectTrigger>
                <SelectContent>
                  {mockMedicos.map(med => (
                    <SelectItem key={med.id} value={med.id}>
                      {med.nome} - CRM {med.crm}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Dados Complementares */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Dados Complementares
            </CardTitle>
            <CardDescription>
              Informações editáveis no SGFC que afetam a priorização
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Prioridade */}
              <div className="space-y-2">
                <Label>Prioridade *</Label>
                <Select 
                  value={formData.prioridade} 
                  onValueChange={(value: "ONC" | "BRE" | "SEM") => 
                    setFormData(prev => ({ ...prev, prioridade: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ONC">Oncológico (ONC)</SelectItem>
                    <SelectItem value="BRE">Com Brevidade (BRE)</SelectItem>
                    <SelectItem value="SEM">Sem Brevidade (SEM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Situação */}
              <div className="space-y-2">
                <Label>Situação *</Label>
                <Select 
                  value={formData.situacao} 
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, situacao: value }))
                    setErrors(prev => ({ ...prev, situacao: "" }))
                  }}
                >
                  <SelectTrigger className={errors.situacao ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecione a situação" />
                  </SelectTrigger>
                  <SelectContent>
                    {situacoes.map(sit => (
                      <SelectItem key={sit.value} value={sit.value}>
                        {sit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.situacao && (
                  <p className="text-sm text-destructive">{errors.situacao}</p>
                )}
              </div>
            </div>

            {/* Medida Judicial */}
            <div className="flex items-center space-x-2">
              <Switch
                id="medida-judicial"
                checked={formData.medidaJudicial}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, medidaJudicial: checked }))
                }
              />
              <Label htmlFor="medida-judicial">Medida Judicial</Label>
            </div>

            {/* Data para novo contato */}
            <div className="space-y-2">
              <Label>Data para novo contato</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dataNovoContato && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dataNovoContato ? (
                      format(formData.dataNovoContato, "PPP", { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dataNovoContato}
                    onSelect={(date) => setFormData(prev => ({ ...prev, dataNovoContato: date }))}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Observações */}
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Observações adicionais (evite dados pessoais sensíveis)"
                value={formData.observacoes}
                onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Auditoria */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Auditoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="motivo-alteracao">Motivo da alteração *</Label>
              <Textarea
                id="motivo-alteracao"
                placeholder="Descreva o motivo para esta inclusão na LEC"
                value={formData.motivoAlteracao}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, motivoAlteracao: e.target.value }))
                  setErrors(prev => ({ ...prev, motivoAlteracao: "" }))
                }}
                className={errors.motivoAlteracao ? "border-destructive" : ""}
                rows={2}
              />
              {errors.motivoAlteracao && (
                <p className="text-sm text-destructive">{errors.motivoAlteracao}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/")}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              "Salvando..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Entrada
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}