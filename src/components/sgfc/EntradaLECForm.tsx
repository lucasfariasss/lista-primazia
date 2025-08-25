import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { EntradaLEC } from "@/types/sgfc"
import { Search, Save, X, Calendar, User, Stethoscope, Activity } from "lucide-react"

interface EntradaLECFormProps {
  entrada?: EntradaLEC
  onSave: (entrada: Partial<EntradaLEC>) => void
  onCancel: () => void
  isEditing?: boolean
  userRole?: 'nir' | 'medico' | 'gestor' | 'admin'
}

// Mock de opções para demonstração
const mockSituacoes = [
  { value: "agendado", label: "Agendado" },
  { value: "aguardando", label: "Aguardando" },
  { value: "cancelado", label: "Cancelado" },
  { value: "realizado", label: "Realizado" }
]

const mockPacientes = [
  { id: "p1", prontuario: "001234", name: "Maria Silva Santos" },
  { id: "p2", prontuario: "002345", name: "José Carlos Lima" },
  { id: "p3", prontuario: "003456", name: "Ana Paula Fernandes" }
]

const mockEspecialidades = [
  { id: "e1", codigo: "ORTOP", name: "Ortopedia" },
  { id: "e2", codigo: "CARDIO", name: "Cardiologia" },
  { id: "e3", codigo: "ONCO", name: "Oncologia" }
]

const mockProcedimentos = [
  { id: "pr1", codigo: "40816015", name: "Artroplastia total do joelho", especialidadeId: "e1" },
  { id: "pr2", codigo: "40901017", name: "Revascularização miocárdica", especialidadeId: "e2" },
  { id: "pr3", codigo: "40814018", name: "Mastectomia radical", especialidadeId: "e3" }
]

const mockMedicos = [
  { id: "m1", crm: "12345", name: "Dr. João Oliveira", especialidades: ["e1"] },
  { id: "m2", crm: "23456", name: "Dra. Ana Cardoso", especialidades: ["e2"] },
  { id: "m3", crm: "34567", name: "Dr. Carlos Oncologista", especialidades: ["e3"] }
]

export function EntradaLECForm({
  entrada,
  onSave,
  onCancel,
  isEditing = false,
  userRole = 'nir'
}: EntradaLECFormProps) {
  const [formData, setFormData] = useState({
    prontuario: entrada?.paciente.prontuario || "",
    pacienteId: entrada?.pacienteId || "",
    especialidadeId: entrada?.especialidadeId || "",
    procedimentoId: entrada?.procedimentoId || "",
    medicoId: entrada?.medicoId || "",
    urgencia: entrada?.urgencia || false,
    oncologico: entrada?.oncologico || false,
    ordemJudicial: entrada?.ordemJudicial || false,
    situacao: "aguardando",
    observacoes: entrada?.observacoes || "",
    dataNovoContato: "",
    motivoAlteracao: ""
  })

  const [searchProntuario, setSearchProntuario] = useState("")
  const [procedimentosFiltrados, setProcedimentosFiltrados] = useState(mockProcedimentos)
  const [medicosFiltrados, setMedicosFiltrados] = useState(mockMedicos)

  const isReadOnly = isEditing && userRole !== 'admin'

  const handleProntuarioSearch = () => {
    const paciente = mockPacientes.find(p => p.prontuario === searchProntuario)
    if (paciente) {
      setFormData({
        ...formData,
        prontuario: paciente.prontuario,
        pacienteId: paciente.id
      })
    }
  }

  const handleEspecialidadeChange = (especialidadeId: string) => {
    setFormData({
      ...formData,
      especialidadeId,
      procedimentoId: "", // Reset procedimento
      medicoId: "" // Reset médico
    })

    // Filtrar procedimentos por especialidade
    const procedimentosFiltrados = mockProcedimentos.filter(
      proc => proc.especialidadeId === especialidadeId
    )
    setProcedimentosFiltrados(procedimentosFiltrados)

    // Filtrar médicos por especialidade
    const medicosFiltrados = mockMedicos.filter(
      medico => medico.especialidades.includes(especialidadeId)
    )
    setMedicosFiltrados(medicosFiltrados)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validações básicas
    if (!formData.pacienteId || !formData.especialidadeId || !formData.procedimentoId) {
      alert("Preencha todos os campos obrigatórios")
      return
    }

    if (isEditing && !formData.motivoAlteracao.trim()) {
      alert("Motivo da alteração é obrigatório")
      return
    }

    onSave(formData)
  }

  const pacienteSelecionado = mockPacientes.find(p => p.id === formData.pacienteId)
  const especialidadeSelecionada = mockEspecialidades.find(e => e.id === formData.especialidadeId)
  const procedimentoSelecionado = procedimentosFiltrados.find(p => p.id === formData.procedimentoId)

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Activity className="h-5 w-5" />
              Editar Entrada na LEC
            </>
          ) : (
            <>
              <Calendar className="h-5 w-5" />
              Nova Entrada na LEC
            </>
          )}
        </CardTitle>
        <CardDescription>
          {isEditing 
            ? "Atualize os dados complementares da entrada na lista de espera cirúrgica"
            : "Registre uma nova entrada na lista de espera cirúrgica"
          }
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Busca de Paciente */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-4 w-4 text-primary" />
              <Label className="text-base font-medium">Paciente</Label>
            </div>
            
            {!isEditing && (
              <div className="flex gap-2">
                <Input
                  placeholder="Digite o prontuário (ex: 001234)"
                  value={searchProntuario}
                  onChange={(e) => setSearchProntuario(e.target.value)}
                  className="font-mono"
                />
                <Button type="button" variant="outline" onClick={handleProntuarioSearch}>
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </div>
            )}

            {pacienteSelecionado && (
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-md">
                <p className="font-medium text-primary">
                  {pacienteSelecionado.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Prontuário: {pacienteSelecionado.prontuario}
                </p>
              </div>
            )}
          </div>

          {/* Dados Médicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-primary" />
                <Label htmlFor="especialidade">Especialidade *</Label>
              </div>
              <Select
                value={formData.especialidadeId}
                onValueChange={handleEspecialidadeChange}
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a especialidade" />
                </SelectTrigger>
                <SelectContent>
                  {mockEspecialidades.map(esp => (
                    <SelectItem key={esp.id} value={esp.id}>
                      {esp.name} ({esp.codigo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="procedimento">Procedimento *</Label>
              <Select
                value={formData.procedimentoId}
                onValueChange={(value) => setFormData({...formData, procedimentoId: value})}
                disabled={!especialidadeSelecionada || isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o procedimento" />
                </SelectTrigger>
                <SelectContent>
                  {procedimentosFiltrados.map(proc => (
                    <SelectItem key={proc.id} value={proc.id}>
                      {proc.name} ({proc.codigo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medico">Médico Responsável</Label>
              <Select
                value={formData.medicoId}
                onValueChange={(value) => setFormData({...formData, medicoId: value})}
                disabled={!especialidadeSelecionada || isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o médico (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {medicosFiltrados.map(medico => (
                    <SelectItem key={medico.id} value={medico.id}>
                      {medico.name} (CRM: {medico.crm})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="situacao">Situação</Label>
              <Select
                value={formData.situacao}
                onValueChange={(value) => setFormData({...formData, situacao: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockSituacoes.map(sit => (
                    <SelectItem key={sit.value} value={sit.value}>
                      {sit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dados de Prioridade */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <Label className="text-base font-medium">Classificação de Prioridade</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="urgencia"
                  checked={formData.urgencia}
                  onCheckedChange={(checked) => setFormData({...formData, urgencia: !!checked})}
                />
                <Label htmlFor="urgencia" className="text-sm font-medium text-urgent">
                  Caso Urgente
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="oncologico"
                  checked={formData.oncologico}
                  onCheckedChange={(checked) => setFormData({...formData, oncologico: !!checked})}
                />
                <Label htmlFor="oncologico" className="text-sm font-medium text-oncologic">
                  Oncológico
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ordemJudicial"
                  checked={formData.ordemJudicial}
                  onCheckedChange={(checked) => setFormData({...formData, ordemJudicial: !!checked})}
                />
                <Label htmlFor="ordemJudicial" className="text-sm font-medium text-legal">
                  Ordem Judicial
                </Label>
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              placeholder="Informações complementares (sem dados pessoais sensíveis)"
              value={formData.observacoes}
              onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
              rows={3}
            />
          </div>

          {/* Data para novo contato */}
          <div className="space-y-2">
            <Label htmlFor="dataNovoContato">Data para Novo Contato</Label>
            <Input
              id="dataNovoContato"
              type="date"
              value={formData.dataNovoContato}
              onChange={(e) => setFormData({...formData, dataNovoContato: e.target.value})}
            />
          </div>

          {/* Motivo da alteração (apenas para edição) */}
          {isEditing && (
            <div className="space-y-2">
              <Label htmlFor="motivoAlteracao">Motivo da Alteração *</Label>
              <Textarea
                id="motivoAlteracao"
                placeholder="Descreva o motivo desta alteração para auditoria"
                value={formData.motivoAlteracao}
                onChange={(e) => setFormData({...formData, motivoAlteracao: e.target.value})}
                required
                rows={2}
              />
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="bg-medical hover:bg-medical/90">
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? "Salvar Alterações" : "Criar Entrada"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}