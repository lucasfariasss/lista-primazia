import { useState, useEffect } from "react"
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
import { useProcedimentos, useEspecialidades, formatProcedimento, formatEspecialidade } from "@/hooks/useSupabaseData"

export default function Procedimentos() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState("")
  
  // Buscar dados do Supabase
  const { procedimentos: procedimentosDB, loading: loadingProc } = useProcedimentos()
  const { especialidades: especialidadesDB, loading: loadingEsp } = useEspecialidades()
  
  const procedimentos = procedimentosDB.map(formatProcedimento)
  const especialidades = especialidadesDB.map(formatEspecialidade)
  const [procedimentosFiltrados, setProcedimentos] = useState<typeof procedimentos>([])

  // Criar mapa de especialidades para lookup
  const especialidadesMap = especialidades.reduce((acc, esp) => {
    acc[esp.id] = esp.nome
    return acc
  }, {} as Record<string, string>)

  const loading = loadingProc || loadingEsp

  useEffect(() => {
    setProcedimentos(procedimentos)
  }, [procedimentos])

  const handleBusca = (termo: string) => {
    setBusca(termo)
    const filtrados = procedimentos.filter(proc => 
      proc.nome.toLowerCase().includes(termo.toLowerCase()) ||
      proc.codigo.includes(termo) ||
      especialidadesMap[proc.especialidadeId]?.toLowerCase().includes(termo.toLowerCase())
    )
    setProcedimentos(filtrados)
  }

  const handleVerNaLEC = (procedimento: any) => {
    // Navegar para o Dashboard LEC com filtro aplicado
    navigate(`/?procedimento=${procedimento.id}&nome=${procedimento.nome}`)
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
                        {procedimento.nome}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Stethoscope className="h-4 w-4 text-primary" />
                          <span>{especialidadesMap[procedimento.especialidadeId]}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={complexity.variant}>
                          {complexity.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-md">
                        <p className="truncate" title={procedimento.nome}>
                          {procedimento.nome}
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