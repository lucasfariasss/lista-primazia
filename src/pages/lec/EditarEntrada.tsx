import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Save, ArrowLeft, User, Stethoscope, Activity, UserCheck, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useEspecialidades, usePacientes, useProcedimentos, useProfissionais, formatEspecialidade, formatPaciente, formatProcedimento, formatProfissional } from "@/hooks/useSupabaseData"

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

// Mock data para entrada existente (será substituído por dados do Supabase)
const mockEntradaExistente: FormData = {
  especialidadeId: "e1",
  procedimentoId: "p1",
  pacienteId: "pac1",
  medicoId: "med1",
  prioridade: "BRE",
  medidaJudicial: true,
  situacao: "PP",
  observacoes: "Paciente aguardando agendamento da cirurgia",
  dataNovoContato: new Date("2024-12-15"),
  motivoAlteracao: ""
}

export default function EditarEntrada() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  // Buscar dados do Supabase
  const { especialidades: especialidadesDB, loading: loadingEspecialidades } = useEspecialidades()
  const { pacientes: pacientesDB, loading: loadingPacientes } = usePacientes()
  const { procedimentos: procedimentosDB, loading: loadingProcedimentos } = useProcedimentos()
  const { profissionais: profissionaisDB, loading: loadingProfissionais } = useProfissionais()
  
  // Converter dados do Supabase para o formato esperado
  const especialidades = especialidadesDB.map(formatEspecialidade)
  const pacientes = pacientesDB.map(formatPaciente)
  const procedimentos = procedimentosDB.map(formatProcedimento)
  const medicos = profissionaisDB.map(formatProfissional)
  
  const [formData, setFormData] = useState<FormData>(mockEntradaExistente)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // Simular perfil do usuário (mock)
  const [isSuperUser] = useState(false) // Para demonstrar campos bloqueados

  // Loading state para dados do Supabase
  const isLoadingData = loadingEspecialidades || loadingPacientes || loadingProcedimentos || loadingProfissionais

  useEffect(() => {
    // Simular carregamento dos dados
    const timer = setTimeout(() => {
      setFormData(mockEntradaExistente)
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [id])

  // Filtrar procedimentos pela especialidade selecionada
  const procedimentosFiltrados = procedimentos.filter(
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
      const procedimento = procedimentos.find(p => p.id === formData.procedimentoId)
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

    setSaving(true)

    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "Entrada atualizada com sucesso",
        description: "As alterações foram salvas e a prioridade foi recalculada."
      })

      // Redirecionar para o detalhe
      navigate(`/lec/${id}`, { replace: true })
    } catch (error) {
      toast({
        title: "Erro ao atualizar entrada",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
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

  if (loading || isLoadingData) {
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/lec/${id}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Editar Entrada na LEC</h1>
          <p className="text-muted-foreground">
            ID: {id} • Atualizando dados da Lista de Espera Cirúrgica
          </p>
        </div>
      </div>

      {/* Aviso sobre campos bloqueados */}
      {!isSuperUser && (
        <Card className="border-warning/20 bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-warning mt-1" />
              <div>
                <h4 className="font-semibold text-warning mb-1">Campos de catálogo bloqueados</h4>
                <p className="text-sm text-muted-foreground">
                  Os campos de vínculo (especialidade, procedimento, paciente, médico) estão desabilitados. 
                  Apenas superusuários podem alterá-los.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vínculos (Catálogos) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Vínculos com Catálogos
              {!isSuperUser && (
                <span className="text-sm font-normal text-muted-foreground">(somente leitura)</span>
              )}
            </CardTitle>
            <CardDescription>
              Dados vindos do sistema hospitalar
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Especialidade */}
            <div className="space-y-2">
              <Label htmlFor="especialidade">Especialidade *</Label>
              <Select 
                value={formData.especialidadeId} 
                onValueChange={handleEspecialidadeChange}
                disabled={!isSuperUser}
              >
                <SelectTrigger className={errors.especialidadeId ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecione a especialidade" />
                </SelectTrigger>
                <SelectContent>
                  {especialidades.map(esp => (
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
                disabled={!isSuperUser}
              >
                <SelectTrigger className={errors.procedimentoId ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecione o procedimento" />
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
                disabled={!isSuperUser}
              >
                <SelectTrigger className={errors.pacienteId ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecione o paciente" />
                </SelectTrigger>
                <SelectContent>
                  {pacientes.map(pac => (
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
                disabled={!isSuperUser}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o médico responsável" />
                </SelectTrigger>
                <SelectContent>
                  {medicos.map(med => (
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
                placeholder="Descreva o motivo para estas alterações na entrada LEC"
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
            onClick={() => navigate(`/lec/${id}`)}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              "Salvando..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}