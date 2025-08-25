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
import { Search, Eye, Users, Shield } from "lucide-react"
import { Patient } from "@/types/sgfc"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { usePacientes, formatPaciente } from "@/hooks/useSupabaseData"

export default function Pacientes() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState("")
  
  // Buscar dados do Supabase
  const { pacientes: pacientesDB, loading } = usePacientes()
  const pacientes = pacientesDB.map(formatPaciente)
  
  const [pacientesFiltrados, setPacientes] = useState<typeof pacientes>([])

  // Atualizar pacientes filtrados quando os dados chegarem
  useEffect(() => {
    setPacientes(pacientes)
  }, [pacientes])

  const handleBusca = (termo: string) => {
    setBusca(termo)
    const filtrados = pacientes.filter(paciente => 
      paciente.nome.toLowerCase().includes(termo.toLowerCase()) ||
      paciente.prontuario.includes(termo)
    )
    setPacientes(filtrados)
  }

  const handleVerNaLEC = (paciente: Patient) => {
    // Navegar para o Dashboard LEC com filtro aplicado
    navigate(`/?paciente=${paciente.id}&nome=${paciente.name}`)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR })
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pacientes Cadastrados</h1>
          <p className="text-muted-foreground mt-2">
            Catálogo de pacientes integrado com o sistema AGHUx (somente leitura)
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          <Users className="h-4 w-4 mr-2" />
          {pacientesFiltrados.length} pacientes
        </Badge>
      </div>

      {/* Avisos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary-light/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-primary">
              <Shield className="h-4 w-4" />
              <span className="font-medium text-sm">
                Dados sensíveis protegidos pela LGPD
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Acesso restrito conforme perfil do usuário logado.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Busca */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Pacientes</CardTitle>
          <CardDescription>
            Pesquise por nome, número do prontuário ou CPF
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Digite nome, prontuário ou CPF..."
              value={busca}
              onChange={(e) => handleBusca(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Pacientes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacientes</CardTitle>
          <CardDescription>
            Clique em "Ver na LEC" para visualizar em quais filas o paciente está cadastrado
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pacientesFiltrados.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prontuário</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Data Nascimento</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead className="w-32">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pacientesFiltrados.map((paciente) => (
                  <TableRow key={paciente.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {paciente.prontuario}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {paciente.name}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {paciente.cpf}
                    </TableCell>
                    <TableCell>
                      {formatDate(paciente.birthDate)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {calculateAge(paciente.birthDate)} anos
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {paciente.phone}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerNaLEC(paciente)}
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
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-lg mb-2">Nenhum paciente encontrado</h3>
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