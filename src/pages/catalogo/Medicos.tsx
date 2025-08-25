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
import { Search, Eye, User } from "lucide-react"
import { Medico } from "@/types/sgfc"
import { useProfissionais, formatProfissional } from "@/hooks/useSupabaseData"

export default function Medicos() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState("")
  
  // Buscar dados do Supabase
  const { profissionais: profissionaisDB, loading } = useProfissionais()
  const medicos = profissionaisDB.map(formatProfissional)
  
  const [medicosFiltrados, setMedicos] = useState<typeof medicos>([])

  // Atualizar médicos filtrados quando os dados chegarem
  useEffect(() => {
    setMedicos(medicos)
  }, [medicos])

  const handleBusca = (termo: string) => {
    setBusca(termo)
    const filtrados = medicos.filter(medico => 
      medico.nome.toLowerCase().includes(termo.toLowerCase()) ||
      medico.crm.includes(termo)
    )
    setMedicos(filtrados)
  }

  const handleVerNaLEC = (medico: Medico) => {
    // Navegar para o Dashboard LEC com filtro aplicado
    navigate(`/?medico=${medico.id}&nome=${medico.name}`)
  }

  if (loading) {
    return (
      <div className="space-y-6">
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
            <CardTitle className="text-sm font-medium">Total de Médicos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {medicosFiltrados.length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Registros no Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {medicos.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">  
            <CardTitle className="text-sm font-medium">Filtrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {medicosFiltrados.length}
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
                  <TableHead>Matrícula</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Responsável</TableHead>
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
                        <span className="font-medium">{medico.nome}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {medico.id === medico.crm ? 'Sem responsável' : `Responsável: ${medico.crm}`}
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