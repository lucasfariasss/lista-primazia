import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useListaEsperaCirurgica } from "@/hooks/useListaEsperaCirurgica"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Save, ArrowLeft, Stethoscope, Activity, UserCheck, AlertCircle } from "lucide-react"
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

// Mock data para entrada existente
const mockEntradaExistente: FormData = {
  especialidadeId: "1",
  procedimentoId: "1", 
  prontuario: "12345",
  pacienteData: { id: "12345", nome: "João da Silva", prontuario: "12345" },
  medicoId: "1",
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
  const { getEntrada, updateEntrada } = useListaEsperaCirurgica()
  
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
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // Simular perfil do usuário (mock)
  const [isSuperUser] = useState(false)

  useEffect(() => {
    const carregarEntrada = async () => {
      if (!id) return
      
      try {
        setLoading(true)
        const entrada = await getEntrada(id)
        
        if (entrada) {
          setFormData({
            especialidadeId: entrada.especialidadeId,
            procedimentoId: entrada.procedimentoId,
            prontuario: entrada.paciente.prontuario,
            pacienteData: entrada.paciente,
            medicoId: entrada.medicoId,
            prioridade: entrada.oncologico ? "ONC" : entrada.urgencia ? "BRE" : "SEM",
            medidaJudicial: entrada.ordemJudicial,
            situacao: "", // Será mapeado conforme necessário
            observacoes: entrada.observacoes || "",
            dataNovoContato: undefined, // Será mapeado conforme necessário
            motivoAlteracao: ""
          })
          
          // Carregar dados iniciais nos selects
          searchEspecialidades("", 0, true)
          searchProfissionais("", 0, true)
          if (entrada.especialidadeId) {
            searchProcedimentos("", entrada.especialidadeId, 0, true)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar entrada:', error)
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados da entrada.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    carregarEntrada()
  }, [id, getEntrada, searchEspecialidades, searchProfissionais, searchProcedimentos, toast])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validarFormulario()) {
      return
    }

    if (!id) return

    setSaving(true)

    try {
      await updateEntrada(id, {
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
        title: "Entrada atualizada com sucesso",
        description: "As alterações foram salvas e a prioridade foi recalculada."
      })

      // Redirecionar para o detalhe
      navigate(`/lec/${id}`, { replace: true })
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar entrada",
        description: error.message || "Ocorreu um erro. Tente novamente.",
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
    
    // Carregar procedimentos da nova especialidade
    searchProcedimentos("", value, 0, true)
  }

  const handleValidPaciente = (paciente: any) => {
    setFormData(prev => ({ ...prev, pacienteData: paciente }))
    setErrors(prev => ({ ...prev, prontuario: "" }))
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
              <AutocompleteSelect
                items={especialidadesResult.items}
                value={formData.especialidadeId}
                onValueChange={handleEspecialidadeChange}
                onSearch={searchEspecialidades}
                loading={especialidadesResult.loading}
                hasMore={especialidadesResult.hasMore}
                error={especialidadesResult.error}
                disabled={!isSuperUser}
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
                disabled={!isSuperUser}
                placeholder="Selecione o procedimento"
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
                disabled={!isSuperUser}
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
                disabled={!isSuperUser}
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
                placeholder="Descreva o motivo para esta alteração"
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