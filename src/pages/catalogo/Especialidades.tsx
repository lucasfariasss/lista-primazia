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
import { Search, Eye, Stethoscope } from "lucide-react"
import { Especialidade } from "@/types/sgfc"

// Mock data para especialidades (vindas do AGHUx)
const mockEspecialidades: Especialidade[] = [
  {
    id: "e1",
    codigo: "ORTOP",
    name: "Ortopedia e Traumatologia",
    description: "Especialidade médica que cuida do sistema músculo-esquelético"
  },
  {
    id: "e2", 
    codigo: "CARDIO",
    name: "Cardiologia",
    description: "Especialidade que trata do sistema cardiovascular"
  },
  {
    id: "e3",
    codigo: "ONCO",
    name: "Oncologia",
    description: "Especialidade dedicada ao estudo e tratamento de neoplasias"
  },
  {
    id: "e4",
    codigo: "NEURO",
    name: "Neurocirurgia",
    description: "Especialidade cirúrgica do sistema nervoso"
  },
  {
    id: "e5",
    codigo: "GASTRO",
    name: "Gastroenterologia",
    description: "Especialidade que trata do sistema digestório"
  },
  {
    id: "e6",
    codigo: "URO",
    name: "Urologia", 
    description: "Especialidade que cuida do sistema urinário e reprodutor masculino"
  }
]

export default function Especialidades() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState("")
  const [especialidadesFiltradas, setEspecialidades] = useState(mockEspecialidades)

  const handleBusca = (termo: string) => {
    setBusca(termo)
    const filtradas = mockEspecialidades.filter(esp => 
      esp.name.toLowerCase().includes(termo.toLowerCase()) ||
      esp.codigo.toLowerCase().includes(termo.toLowerCase()) ||
      esp.description?.toLowerCase().includes(termo.toLowerCase())
    )
    setEspecialidades(filtradas)
  }

  const handleVerNaLEC = (especialidade: Especialidade) => {
    // Navegar para o Dashboard LEC com filtro aplicado
    navigate(`/?especialidade=${especialidade.id}&nome=${especialidade.name}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Especialidades Médicas</h1>
          <p className="text-muted-foreground mt-2">
            Catálogo de especialidades integrado com o sistema AGHUx (somente leitura)
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          <Stethoscope className="h-4 w-4 mr-2" />
          {especialidadesFiltradas.length} especialidades
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
          <CardTitle>Buscar Especialidades</CardTitle>
          <CardDescription>
            Pesquise por nome, código ou descrição da especialidade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Digite para buscar especialidades..."
              value={busca}
              onChange={(e) => handleBusca(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Especialidades */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Especialidades</CardTitle>
          <CardDescription>
            Clique em "Ver na LEC" para visualizar a fila de espera da especialidade
          </CardDescription>
        </CardHeader>
        <CardContent>
          {especialidadesFiltradas.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-32">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {especialidadesFiltradas.map((especialidade) => (
                  <TableRow key={especialidade.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {especialidade.codigo}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {especialidade.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {especialidade.description}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerNaLEC(especialidade)}
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
              <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-lg mb-2">Nenhuma especialidade encontrada</h3>
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