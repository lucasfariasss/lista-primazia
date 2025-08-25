import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EntradaLEC } from "@/types/sgfc"
import { Users, Clock, AlertTriangle, Scale, TrendingUp, Calendar, Activity, PieChart } from "lucide-react"

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
  // Dados estatísticos (serão conectados à API futuramente)
  const totalPacientes = mockEntradas.length
  const tempoMedioEspera = Math.round(
    mockEntradas.reduce((acc, e) => acc + e.diasEspera, 0) / totalPacientes
  )
  const pacientesUrgentes = mockEntradas.filter(e => e.urgencia).length
  const pacientesJudiciais = mockEntradas.filter(e => e.ordemJudicial).length
  
  // Estatísticas por especialidade
  const distribuicaoEspecialidades = mockEntradas.reduce((acc, entrada) => {
    const esp = entrada.especialidade.name
    acc[esp] = (acc[esp] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  // Top 3 especialidades
  const topEspecialidades = Object.entries(distribuicaoEspecialidades)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard LEC</h1>
        <p className="text-muted-foreground mt-2">
          Visão geral e indicadores da Lista de Espera Cirúrgica
        </p>
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

      {/* Seção de Indicadores por Especialidade */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Distribuição por Especialidade
            </CardTitle>
            <CardDescription>
              Pacientes na fila por área médica
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topEspecialidades.map(([especialidade, quantidade], index) => (
                <div key={especialidade} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-primary' : 
                      index === 1 ? 'bg-secondary' : 'bg-accent'
                    }`} />
                    <span className="font-medium text-sm">{especialidade}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-primary">{quantidade}</span>
                    <span className="text-xs text-muted-foreground ml-1">pacientes</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Métricas de Performance
            </CardTitle>
            <CardDescription>
              Indicadores de eficiência da fila
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Tempo médio global</span>
                </div>
                <span className="font-bold text-primary">{tempoMedioEspera} dias</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Taxa de casos urgentes</span>
                </div>
                <span className="font-bold text-urgent">
                  {Math.round((pacientesUrgentes / totalPacientes) * 100)}%
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Scale className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Casos judiciais</span>
                </div>
                <span className="font-bold text-legal">
                  {Math.round((pacientesJudiciais / totalPacientes) * 100)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}