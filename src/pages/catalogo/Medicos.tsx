import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Eye, User, Stethoscope } from "lucide-react"
import { Medico } from "@/types/sgfc"

// Mock data para médicos (vindos do AGHUx)
const mockMedicos: Medico[] = [
  {
    id: "m1",
    crm: "12345",
    name: "Dr. João Oliveira Santos",
    especialidades: ["e1", "e4"] // Ortopedia e Neurocirurgia
  },
  {
    id: "m2",
    crm: "23456",
    name: "Dra. Ana Cardoso Silva",
    especialidades: ["e2"] // Cardiologia
  },
  {
    id: "m3",
    crm: "34567",
    name: "Dr. Carlos Oncologista Lima",
    especialidades: ["e3"] // Oncologia
  },
  {
    id: "m4",
    crm: "45678",
    name: "Dra. Maria Neurocirurgiã Costa",
    especialidades: ["e4"] // Neurocirurgia
  },
  {
    id: "m5",
    crm: "56789",
    name: "Dr. Pedro Gastroenterologista",
    especialidades: ["e5", "e3"] // Gastro e Oncologia
  },
  {
    id: "m6",
    crm: "67890",
    name: "Dr. Roberto Urologista Mendes",
    especialidades: ["e6"] // Urologia
  },
  {
    id: "m7",
    crm: "78901",
    name: "Dra. Fernanda Ortopedista Alves",
    especialidades: ["e1"] // Ortopedia
  }
]

// Mock de especialidades para mostrar o nome
const especialidades: Record<string, string> = {
  "e1": "Ortopedia",
  "e2": "Cardiologia", 
  "e3": "Oncologia",
  "e4": "Neurocirurgia",
  "e5": "Gastroenterologia",
  "e6": "Urologia"
}

export default function Medicos() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState("")
  const [medicosFiltrados, setMedicos] = useState(mockMedicos)

  const handleBusca = (termo: string) => {
    setBusca(termo)
    const filtrados = mockMedicos.filter(medico => 
      medico.name.toLowerCase().includes(termo.toLowerCase()) ||
      medico.crm.includes(termo) ||
      medico.especialidades.some(espId => 
        especialidades[espId]?.toLowerCase().includes(termo.toLowerCase())
      )
    )
    setMedicos(filtrados)
  }

  const handleVerNaLEC = (medico: Medico) => {
    // Navegar para o Dashboard LEC com filtro aplicado
    navigate(`/?medico=${medico.id}&nome=${medico.name}`)
  }

  const getEspecialidadesBadges = (especialidadesIds: string[]) => {
    return especialidadesIds.map(espId => (
      <Badge key={espId} variant="secondary" className="text-xs">
        {especialidades[espId]}
      </Badge>
    ))
  }

  const getStatusBadge = (medicoId: string) => {
    // Simular status baseado no ID
    const isActive = parseInt(medicoId.substring(1)) % 2 === 1
    return isActive ? 
      <Badge variant="success">Ativo</Badge> : 
      <Badge variant="outline">Inativo</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Médicos Cadastrados</h1>
          <p className="text-muted-foreground mt-2">
            Catálogo de médicos integrado com o sistema AGHUx (somente leitura)
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          <User className="h-4 w-4 mr-2" />
          {medicosFiltrados.length} médicos
        </Badge>
      </div>

      {/* Aviso sobre dados read-only */}
      <Card className="border-warning/20 bg-warning/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-warning">
            <Search className="h-4 w-4" />
            <span className="font-medium text-sm">
              Dados integrados do AGHUx - Somente consulta
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Este catálogo é sincronizado automaticamente com o sistema hospitalar. 
            Para alterações, utilize o sistema AGHUx.
          </p>
        </CardContent>
      </Card>

      {/* Busca */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Médicos</CardTitle>
          <CardDescription>
            Pesquise por nome, CRM ou especialidade do médico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Digite para buscar médicos..."
              value={busca}
              onChange={(e) => handleBusca(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Médicos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {medicosFiltrados.filter((_, i) => (i + 1) % 2 === 1).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Especialidades Cobertas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {new Set(medicosFiltrados.flatMap(m => m.especialidades)).size}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Multiespecialistas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {medicosFiltrados.filter(m => m.especialidades.length > 1).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Médicos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Médicos</CardTitle>
          <CardDescription>
            Clique em "Ver na LEC" para visualizar as filas do médico
          </CardDescription>
        </CardHeader>
        <CardContent>
          {medicosFiltrados.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CRM</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Especialidades</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-32">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicosFiltrados.map((medico) => (
                  <TableRow key={medico.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {medico.crm}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{medico.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {getEspecialidadesBadges(medico.especialidades)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(medico.id)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerNaLEC(medico)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver na LEC
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-lg mb-2">Nenhum médico encontrado</h3>
              <p className="text-muted-foreground">
                Tente ajustar os critérios de busca.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}