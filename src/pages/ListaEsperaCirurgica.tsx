import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LECTable } from "@/components/sgfc/LECTable"
import { EntradaLEC, FilterLEC } from "@/types/sgfc"
import { Plus, Filter, X, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Mock data para demonstração - mesmos dados do Dashboard
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
    scorePrioridade: 4455,
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
    scorePrioridade: 60,
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
    scorePrioridade: 36.4,
    posicao: 3,
    ativo: true,
    criadoPor: "nir002",
    criadoEm: "2024-02-01T10:45:00Z"
  }
]

export default function ListaEsperaCirurgica() {
  const [filters, setFilters] = useState<FilterLEC>({})
  const [filteredEntradas, setFilteredEntradas] = useState(mockEntradas)
  const [showFilters, setShowFilters] = useState(false)
  const [searchProntuario, setSearchProntuario] = useState("")

  const handleEdit = (entrada: EntradaLEC) => {
    console.log("Edit entrada:", entrada.id)
    // TODO: Implementar navegação para formulário de edição
  }

  const handleRemove = (entrada: EntradaLEC) => {
    console.log("Remove entrada:", entrada.id)
    // TODO: Implementar modal de confirmação e remoção
  }

  const handleView = (entrada: EntradaLEC) => {
    console.log("View entrada:", entrada.id)
    // TODO: Implementar modal de detalhes
  }

  const handleNovaEntrada = () => {
    console.log("Nova entrada")
    // TODO: Implementar navegação para formulário de nova entrada
  }

  const clearFilters = () => {
    setFilters({})
    setSearchProntuario("")
    setFilteredEntradas(mockEntradas)
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length + (searchProntuario ? 1 : 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lista de Espera Cirúrgica</h1>
          <p className="text-muted-foreground mt-2">
            Gestão completa das entradas na fila cirúrgica com priorização automática
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          <Button onClick={handleNovaEntrada} className="bg-medical hover:bg-medical/90">
            <Plus className="h-4 w-4 mr-2" />
            Nova Entrada
          </Button>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Filtros Avançados
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Prontuário</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="000000"
                    value={searchProntuario}
                    onChange={(e) => setSearchProntuario(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Especialidade</label>
                <Select value={filters.especialidadeId || ""} onValueChange={(value) => setFilters({...filters, especialidadeId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as especialidades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as especialidades</SelectItem>
                    <SelectItem value="e1">Ortopedia</SelectItem>
                    <SelectItem value="e2">Cardiologia</SelectItem>
                    <SelectItem value="e3">Oncologia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Médico</label>
                <Select value={filters.medicoId || ""} onValueChange={(value) => setFilters({...filters, medicoId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os médicos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os médicos</SelectItem>
                    <SelectItem value="m1">Dr. João Oliveira</SelectItem>
                    <SelectItem value="m2">Dra. Ana Cardoso</SelectItem>
                    <SelectItem value="m3">Dr. Carlos Oncologista</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Prioridade</label>
                <Select value={filters.urgencia?.toString() || ""} onValueChange={(value) => setFilters({...filters, urgencia: value === "true" ? true : value === "false" ? false : undefined})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os tipos</SelectItem>
                    <SelectItem value="true">Apenas urgentes</SelectItem>
                    <SelectItem value="false">Apenas não urgentes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Ordem Judicial</label>
                <Select value={filters.ordemJudicial?.toString() || ""} onValueChange={(value) => setFilters({...filters, ordemJudicial: value === "true" ? true : value === "false" ? false : undefined})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="true">Com ordem judicial</SelectItem>
                    <SelectItem value="false">Sem ordem judicial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Oncológico</label>
                <Select value={filters.oncologico?.toString() || ""} onValueChange={(value) => setFilters({...filters, oncologico: value === "true" ? true : value === "false" ? false : undefined})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="true">Oncológicos</SelectItem>
                    <SelectItem value="false">Não oncológicos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Status</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="ativo">Ativos</SelectItem>
                    <SelectItem value="inativo">Inativos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  <X className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros ativos */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filtros ativos:</span>
          {searchProntuario && (
            <Badge variant="secondary" className="gap-1">
              Prontuário: {searchProntuario}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchProntuario("")} />
            </Badge>
          )}
          {filters.especialidadeId && (
            <Badge variant="secondary" className="gap-1">
              Especialidade aplicada
              <X className="h-3 w-3 cursor-pointer" onClick={() => setFilters({...filters, especialidadeId: undefined})} />
            </Badge>
          )}
          {/* Adicionar mais badges conforme necessário */}
        </div>
      )}

      {/* Tabela */}
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