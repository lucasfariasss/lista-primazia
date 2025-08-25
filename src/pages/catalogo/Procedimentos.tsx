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
import { Search, Eye, Activity, Stethoscope } from "lucide-react"
import { Procedimento } from "@/types/sgfc"

// Mock data para procedimentos (vindos do AGHUx)
const mockProcedimentos: Procedimento[] = [
  {
    id: "pr1",
    codigo: "40816015",
    name: "Artroplastia total do joelho",
    especialidadeId: "e1",
    description: "Substituição total da articulação do joelho por prótese"
  },
  {
    id: "pr2",
    codigo: "40901017",
    name: "Revascularização miocárdica",
    especialidadeId: "e2",
    description: "Cirurgia de ponte de safena para revascularização do coração"
  },
  {
    id: "pr3",
    codigo: "40814018",
    name: "Mastectomia radical",
    especialidadeId: "e3",
    description: "Cirurgia para remoção completa da mama"
  },
  {
    id: "pr4",
    codigo: "40701019",
    name: "Craniotomia para tumor",
    especialidadeId: "e4",
    description: "Abertura do crânio para remoção de tumor cerebral"
  },
  {
    id: "pr5",
    codigo: "40501020",
    name: "Gastrectomia total",
    especialidadeId: "e5",
    description: "Remoção completa do estômago"
  },
  {
    id: "pr6",
    codigo: "40301021",
    name: "Prostatectomia radical",
    especialidadeId: "e6",
    description: "Remoção completa da próstata"
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

export default function Procedimentos() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState("")
  const [procedimentosFiltrados, setProcedimentos] = useState(mockProcedimentos)

  const handleBusca = (termo: string) => {
    setBusca(termo)
    const filtrados = mockProcedimentos.filter(proc => 
      proc.name.toLowerCase().includes(termo.toLowerCase()) ||
      proc.codigo.includes(termo) ||
      proc.description?.toLowerCase().includes(termo.toLowerCase()) ||
      especialidades[proc.especialidadeId]?.toLowerCase().includes(termo.toLowerCase())
    )
    setProcedimentos(filtrados)
  }

  const handleVerNaLEC = (procedimento: Procedimento) => {
    // Navegar para o Dashboard LEC com filtro aplicado
    navigate(`/?procedimento=${procedimento.id}&nome=${procedimento.name}`)
  }

  const getComplexityBadge = (codigo: string) => {
    // Simular complexidade baseada no código
    const num = parseInt(codigo.substring(3, 5))
    if (num >= 80) return { variant: "urgent" as const, label: "Alta" }
    if (num >= 60) return { variant: "warning" as const, label: "Média" }
    return { variant: "success" as const, label: "Baixa" }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Procedimentos Cirúrgicos</h1>
          <p className="text-muted-foreground mt-2">
            Catálogo de procedimentos integrado com o sistema AGHUx (somente leitura)
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          <Activity className="h-4 w-4 mr-2" />
          {procedimentosFiltrados.length} procedimentos
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
          <CardTitle>Buscar Procedimentos</CardTitle>
          <CardDescription>
            Pesquise por nome, código, descrição ou especialidade do procedimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Digite para buscar procedimentos..."
              value={busca}
              onChange={(e) => handleBusca(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Procedimentos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Procedimentos</CardTitle>
          <CardDescription>
            Clique em "Ver na LEC" para visualizar a fila de espera do procedimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          {procedimentosFiltrados.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Especialidade</TableHead>
                  <TableHead>Complexidade</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-32">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {procedimentosFiltrados.map((procedimento) => {
                  const complexity = getComplexityBadge(procedimento.codigo)
                  return (
                    <TableRow key={procedimento.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {procedimento.codigo}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {procedimento.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Stethoscope className="h-4 w-4 text-primary" />
                          <span>{especialidades[procedimento.especialidadeId]}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={complexity.variant}>
                          {complexity.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-md">
                        <p className="truncate" title={procedimento.description}>
                          {procedimento.description}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVerNaLEC(procedimento)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver na LEC
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-lg mb-2">Nenhum procedimento encontrado</h3>
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