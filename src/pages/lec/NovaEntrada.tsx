import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useListaEsperaCirurgica } from "@/hooks/useListaEsperaCirurgica"
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
import { 
  useEspecialidadesSearch, 
  useProcedimentosSearch, 
  useProfissionaisSearch 
} from "@/hooks/useIncrementalData"
import { AutocompleteSelect } from "@/components/ui/autocomplete-select"
import { ProntuarioField } from "@/components/lec/ProntuarioField"

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
  prontuario: string
  pacienteData: any | null
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
  
  // Hooks para busca incremental
  const { result: especialidadesResult, searchEspecialidades } = useEspecialidadesSearch()
  const { result: procedimentosResult, searchProcedimentos } = useProcedimentosSearch()
  const { result: profissionaisResult, searchProfissionais } = useProfissionaisSearch()
  
  const [formData, setFormData] = useState<FormData>({
    especialidadeId: "",
    procedimentoId: "",
    prontuario: "",
    pacienteData: null,
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

  // Validação do formulário
  const validarFormulario = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.especialidadeId) newErrors.especialidadeId = "Especialidade é obrigatória"
    if (!formData.procedimentoId) newErrors.procedimentoId = "Procedimento é obrigatório"
    if (!formData.prontuario.trim()) newErrors.prontuario = "Prontuário é obrigatório"
    if (!formData.pacienteData) newErrors.prontuario = "Prontuário deve ser validado"
    if (!formData.situacao) newErrors.situacao = "Situação é obrigatória"
    if (!formData.motivoAlteracao.trim()) newErrors.motivoAlteracao = "Motivo da alteração é obrigatório"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const { createEntrada } = useListaEsperaCirurgica()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validarFormulario()) {
      return
    }

    setLoading(true)

    try {
      const novaEntradaId = await createEntrada({
        prontuario: parseInt(formData.prontuario),
        cod_especialidade: parseInt(formData.especialidadeId),
        cod_procedimento: parseInt(formData.procedimentoId),
        matricula_medico: formData.medicoId ? parseInt(formData.medicoId) : undefined,
        prioridade: formData.prioridade,
        medida_judicial: formData.medidaJudicial,
        situacao: formData.situacao as any,
        observacoes: formData.observacoes || undefined,
        data_novo_contato: formData.dataNovoContato ? format(formData.dataNovoContato, 'yyyy-MM-dd') : undefined
      })
      
      toast({
        title: "Entrada criada com sucesso",
        description: "A nova entrada foi adicionada à Lista de Espera Cirúrgica."
      })

      // Redirecionar para o detalhe
      navigate(`/lec/${novaEntradaId}`, { replace: true })
    } catch (error: any) {
      toast({
        title: "Erro ao criar entrada",
        description: error.message || "Ocorreu um erro. Tente novamente.",
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
    
    // Limpar procedimentos ao trocar especialidade
    searchProcedimentos("", value, 0, true)
  }

  const handleValidPaciente = (paciente: any) => {
    setFormData(prev => ({ ...prev, pacienteData: paciente }))
    setErrors(prev => ({ ...prev, prontuario: "" }))
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
              <AutocompleteSelect
                items={especialidadesResult.items}
                value={formData.especialidadeId}
                onValueChange={handleEspecialidadeChange}
                onSearch={searchEspecialidades}
                loading={especialidadesResult.loading}
                hasMore={especialidadesResult.hasMore}
                error={especialidadesResult.error}
                placeholder="Selecione a especialidade"
                searchPlaceholder="Buscar especialidade..."
                className={errors.especialidadeId ? "border-destructive" : ""}
              />
              {errors.especialidadeId && (
                <p className="text-sm text-destructive">{errors.especialidadeId}</p>
              )}
            </div>

            {/* Procedimento */}
            <div className="space-y-2">
              <Label htmlFor="procedimento">Procedimento *</Label>
              <AutocompleteSelect
                items={procedimentosResult.items}
                value={formData.procedimentoId}
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, procedimentoId: value }))
                  setErrors(prev => ({ ...prev, procedimentoId: "" }))
                }}
                onSearch={(query, page, reset) => 
                  searchProcedimentos(query, formData.especialidadeId, page, reset)
                }
                loading={procedimentosResult.loading}
                hasMore={procedimentosResult.hasMore}
                error={procedimentosResult.error}
                disabled={!formData.especialidadeId}
                placeholder={
                  formData.especialidadeId 
                    ? "Selecione o procedimento" 
                    : "Primeiro selecione uma especialidade"
                }
                searchPlaceholder="Buscar procedimento..."
                className={errors.procedimentoId ? "border-destructive" : ""}
              />
              {errors.procedimentoId && (
                <p className="text-sm text-destructive">{errors.procedimentoId}</p>
              )}
            </div>

            {/* Prontuário do Paciente */}
            <div className="space-y-2">
              <ProntuarioField
                value={formData.prontuario}
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, prontuario: value }))
                  setErrors(prev => ({ ...prev, prontuario: "" }))
                }}
                onValidPaciente={handleValidPaciente}
                error={errors.prontuario}
                required={true}
              />
            </div>

            {/* Médico */}
            <div className="space-y-2">
              <Label htmlFor="medico">Médico (Opcional)</Label>
              <AutocompleteSelect
                items={profissionaisResult.items}
                value={formData.medicoId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, medicoId: value }))}
                onSearch={searchProfissionais}
                loading={profissionaisResult.loading}
                hasMore={profissionaisResult.hasMore}
                error={profissionaisResult.error}
                placeholder="Selecione o médico responsável"
                searchPlaceholder="Buscar médico..."
              />
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