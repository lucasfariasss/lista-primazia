import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LECTable } from "@/components/sgfc/LECTable"
import { EntradaLEC, FilterLEC } from "@/types/sgfc"
import { Plus, Filter, Download, Users, Clock, AlertTriangle, Scale } from "lucide-react"

// Mock data para demonstração
const mockEntradas: EntradaLEC[] = [
  {
    id: "1",
    pacienteId: "p1",
    paciente: {
      id: "p1",
      prontuario: "001234",
      name: "Maria Silva Santos",
      cpf: "123.456.789-00",
      birthDate: "1965-03-15",
      phone: "(83) 99999-1234"
    },
    especialidadeId: "e1",
    especialidade: {
      id: "e1",
      codigo: "ORTOP",
      name: "Ortopedia"
    },
    procedimentoId: "pr1",
    procedimento: {
      id: "pr1",
      codigo: "40816015",
      name: "Artroplastia total do joelho",
      especialidadeId: "e1"
    },
    medicoId: "m1",
    medico: {
      id: "m1",
      crm: "12345",
      name: "Dr. João Oliveira",
      especialidades: ["e1"]
    },
    dataEntrada: "2024-01-15",
    urgencia: false,
    oncologico: false,
    ordemJudicial: true,
    diasEspera: 45,
    scorePrioridade: 4455, // 45 * 99 (judicial)
    posicao: 1,
    ativo: true,
    criadoPor: "nir001",
    criadoEm: "2024-01-15T08:30:00Z"
  },
  {
    id: "2",
    pacienteId: "p2",
    paciente: {
      id: "p2",
      prontuario: "002345",
      name: "José Carlos Lima",
      cpf: "987.654.321-00",
      birthDate: "1958-08-22",
      phone: "(83) 98888-5678"
    },
    especialidadeId: "e2",
    especialidade: {
      id: "e2",
      codigo: "CARDIO",
      name: "Cardiologia"
    },
    procedimentoId: "pr2",
    procedimento: {
      id: "pr2",
      codigo: "40901017",
      name: "Revascularização miocárdica",
      especialidadeId: "e2"
    },
    medicoId: "m2",
    medico: {
      id: "m2",
      crm: "23456",
      name: "Dra. Ana Cardoso",
      especialidades: ["e2"]
    },
    dataEntrada: "2024-01-20",
    urgencia: true,
    oncologico: false,
    ordemJudicial: false,
    diasEspera: 40,
    scorePrioridade: 60, // 40 * 1.5 (urgente)
    posicao: 2,
    ativo: true,
    criadoPor: "medico001",
    criadoEm: "2024-01-20T14:15:00Z"
  },
  {
    id: "3",
    pacienteId: "p3",
    paciente: {
      id: "p3",
      prontuario: "003456",
      name: "Ana Paula Fernandes",
      cpf: "456.789.123-00",
      birthDate: "1972-11-08",
      phone: "(83) 97777-9012"
    },
    especialidadeId: "e3",
    especialidade: {
      id: "e3",
      codigo: "ONCO",
      name: "Oncologia"
    },
    procedimentoId: "pr3",
    procedimento: {
      id: "pr3",
      codigo: "40814018",
      name: "Mastectomia radical",
      especialidadeId: "e3"
    },
    medicoId: "m3",
    medico: {
      id: "m3",
      crm: "34567",
      name: "Dr. Carlos Oncologista",
      especialidades: ["e3"]
    },
    dataEntrada: "2024-02-01",
    urgencia: false,
    oncologico: true,
    ordemJudicial: false,
    diasEspera: 28,
    scorePrioridade: 36.4, // 28 * 1.3 (oncológico)
    posicao: 3,
    ativo: true,
    criadoPor: "nir002",
    criadoEm: "2024-02-01T10:45:00Z"
  }
]

export default function Dashboard() {
  const [filters, setFilters] = useState<FilterLEC>({})
  const [filteredEntradas, setFilteredEntradas] = useState(mockEntradas)

  // Estatísticas para os cards
  const totalPacientes = filteredEntradas.length
  const tempoMedioEspera = Math.round(
    filteredEntradas.reduce((acc, e) => acc + e.diasEspera, 0) / totalPacientes
  )
  const pacientesUrgentes = filteredEntradas.filter(e => e.urgencia).length
  const pacientesJudiciais = filteredEntradas.filter(e => e.ordemJudicial).length

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
            <div className="text-2xl font-bold text-primary">{totalPacientes}</div>
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
            <div className="text-2xl font-bold text-primary">{tempoMedioEspera}</div>
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
            <div className="text-2xl font-bold text-urgent">{pacientesUrgentes}</div>
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
            <div className="text-2xl font-bold text-legal">{pacientesJudiciais}</div>
            <p className="text-xs text-muted-foreground">
              Com determinação judicial
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela principal */}
      <LECTable
        entradas={filteredEntradas}
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