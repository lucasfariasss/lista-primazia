import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Shield, UserCheck, AlertCircle, Scale, Heart, Clock } from "lucide-react"
import { Link } from "react-router-dom"

// Tipos para a consulta pública (dados anonimizados)
interface EntradaPublica {
  id: string
  prontuario: string
  posicao: number | null
  especialidade: string
  procedimento: string
  medico?: string
  situacao: string
  prioridade: "ONC" | "BRE" | "SEM"
  medida_judicial: boolean
  ativo: boolean
}

// Mock para consulta pública (múltiplas entradas por prontuário)
const mockConsultaResults: Record<string, EntradaPublica[]> = {
  "001234": [
    {
      id: "1",
      prontuario: "001234", 
      posicao: 3,
      especialidade: "Ortopedia",
      procedimento: "Artroplastia total do joelho",
      medico: "Dr. João Oliveira",
      situacao: "PACIENTE PRONTO PARA CIRURGIA",
      prioridade: "BRE",
      medida_judicial: true,
      ativo: true
    },
    {
      id: "2", 
      prontuario: "001234",
      posicao: null,
      especialidade: "Cirurgia Geral",
      procedimento: "Colecistectomia por videolaparoscopia",
      medico: "Dra. Maria Santos",
      situacao: "EXAMES PENDENTES",
      prioridade: "SEM",
      medida_judicial: false,
      ativo: false
    },
    {
      id: "3",
      prontuario: "001234",
      posicao: 1,
      especialidade: "Oncologia",
      procedimento: "Ressecção de tumor colorretal",
      situacao: "CONSULTA AGENDADA",
      prioridade: "ONC", 
      medida_judicial: false,
      ativo: true
    }
  ],
  "005678": [
    {
      id: "4",
      prontuario: "005678",
      posicao: 15,
      especialidade: "Cardiologia",
      procedimento: "Revascularização do miocárdio",
      medico: "Dr. Carlos Lima",
      situacao: "DOCUMENTOS PENDENTES",
      prioridade: "BRE",
      medida_judicial: false,
      ativo: true
    }
  ]
}

// Componente para card de entrada individual
function EntradaCard({ entrada }: { entrada: EntradaPublica }) {
  const getPrioridadeIcon = (prioridade: string) => {
    switch (prioridade) {
      case "ONC": return <Heart className="h-4 w-4" />
      case "BRE": return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "ONC": return "oncology"
      case "BRE": return "urgent"
      default: return "secondary"
    }
  }

  return (
    <Card className="border-l-4 border-l-primary/30">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {entrada.posicao ? (
              <Badge variant="priority" className="text-lg font-bold px-3 py-1">
                #{entrada.posicao}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-sm">
                Inativo
              </Badge>
            )}
            <Badge 
              variant={entrada.ativo ? "success" : "secondary"}
              className="text-xs"
            >
              {entrada.ativo ? "Ativo" : "Inativo"}
            </Badge>
          </div>
          
          <div className="flex gap-1">
            {entrada.medida_judicial && (
              <Badge variant="legal" className="text-xs">
                <Scale className="h-3 w-3 mr-1" />
                Judicial
              </Badge>
            )}
            <Badge 
              variant={getPrioridadeColor(entrada.prioridade) as any}
              className="text-xs"
            >
              {getPrioridadeIcon(entrada.prioridade)}
              {entrada.prioridade === "ONC" ? "Oncológico" : 
               entrada.prioridade === "BRE" ? "Com Brevidade" : "Sem Brevidade"}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <p className="font-medium text-primary">{entrada.especialidade}</p>
            <p className="text-sm text-muted-foreground">{entrada.procedimento}</p>
          </div>
          
          {entrada.medico && (
            <p className="text-sm text-muted-foreground">
              <UserCheck className="h-4 w-4 inline mr-1" />
              {entrada.medico}
            </p>
          )}
          
          <Badge variant="outline" className="text-xs">
            {entrada.situacao}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ConsultaPublica() {
  const [prontuario, setProntuario] = useState("")
  const [resultado, setResultado] = useState<EntradaPublica[]>([])
  const [filtroAtivo, setFiltroAtivo] = useState<"todos" | "ativos" | "inativos">("todos")
  const [loading, setLoading] = useState(false)
  const [consultaRealizada, setConsultaRealizada] = useState(false)
  const [erro, setErro] = useState("")

  const handleConsulta = async () => {
    if (!prontuario.trim()) {
      setErro("Digite um prontuário válido.")
      return
    }

    setLoading(true)
    setErro("")
    
    // Simular consulta na API
    setTimeout(() => {
      const resultados = mockConsultaResults[prontuario.trim()]
      if (resultados) {
        setResultado(resultados)
      } else {
        setResultado([])
      }
      setConsultaRealizada(true)
      setLoading(false)
    }, 1000)
  }

  const entradasFiltradas = resultado.filter(entrada => {
    if (filtroAtivo === "ativos") return entrada.ativo
    if (filtroAtivo === "inativos") return !entrada.ativo
    return true
  })

  const contadores = {
    total: resultado.length,
    ativos: resultado.filter(e => e.ativo).length,
    inativos: resultado.filter(e => !e.ativo).length
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary-glow rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Consulta da Fila Cirúrgica (LEC)
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Consulte de forma transparente e segura sua posição na fila de espera cirúrgica. 
            Apenas dados essenciais são exibidos, em conformidade com a LGPD.
          </p>
        </div>

        {/* Aviso de Privacidade */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold text-primary mb-2">Proteção de Dados Pessoais</h3>
                <p className="text-sm text-muted-foreground">
                  Esta consulta mostra apenas informações essenciais (posição, especialidade, procedimento, status). 
                  Nenhum dado pessoal identificável é exibido publicamente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulário de Consulta */}
        <Card className="shadow-elegant">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Consultar Posição na Fila</CardTitle>
            <CardDescription>
              Digite seu número de prontuário para ver em quais filas você está cadastrado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Número do prontuário (ex: 001234, 005678)"
                value={prontuario}
                onChange={(e) => {
                  setProntuario(e.target.value)
                  setErro("")
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleConsulta()}
                className="flex-1 text-center text-lg"
                error={!!erro}
              />
              <Button 
                onClick={handleConsulta}
                disabled={loading || !prontuario.trim()}
                size="lg"
                className="px-8"
              >
                {loading ? (
                  "Consultando..."
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Consultar
                  </>
                )}
              </Button>
            </div>
            
            {erro && (
              <p className="text-sm text-destructive text-center">{erro}</p>
            )}

            {/* Link para admin */}
            <div className="pt-4 border-t text-center">
              <Link 
                to="/login" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <UserCheck className="h-4 w-4 inline mr-1" />
                Sou da equipe / Fazer login no Admin
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Resultado da Consulta */}
        {consultaRealizada && (
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Resultado da Consulta
                <Badge variant="outline">Prontuário: {prontuario}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {resultado.length > 0 ? (
                <div className="space-y-6">
                  {/* Resumo */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-secondary/10 rounded-lg">
                      <p className="text-2xl font-bold text-primary">{contadores.total}</p>
                      <p className="text-sm text-muted-foreground">Total de Filas</p>
                    </div>
                    <div className="text-center p-4 bg-success/10 rounded-lg">
                      <p className="text-2xl font-bold text-success">{contadores.ativos}</p>
                      <p className="text-sm text-muted-foreground">Filas Ativas</p>
                    </div>
                    <div className="text-center p-4 bg-muted/10 rounded-lg">
                      <p className="text-2xl font-bold text-muted-foreground">{contadores.inativos}</p>
                      <p className="text-sm text-muted-foreground">Filas Inativas</p>
                    </div>
                  </div>

                  {/* Filtros */}
                  <Tabs value={filtroAtivo} onValueChange={(v) => setFiltroAtivo(v as any)}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="todos">
                        Todos ({contadores.total})
                      </TabsTrigger>
                      <TabsTrigger value="ativos">
                        Ativos ({contadores.ativos})
                      </TabsTrigger>
                      <TabsTrigger value="inativos">
                        Inativos ({contadores.inativos})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="todos" className="mt-6">
                      <div className="grid gap-4">
                        {entradasFiltradas.map((entrada) => (
                          <EntradaCard key={entrada.id} entrada={entrada} />
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="ativos" className="mt-6">
                      <div className="grid gap-4">
                        {entradasFiltradas.map((entrada) => (
                          <EntradaCard key={entrada.id} entrada={entrada} />
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="inativos" className="mt-6">
                      <div className="grid gap-4">
                        {entradasFiltradas.map((entrada) => (
                          <EntradaCard key={entrada.id} entrada={entrada} />
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-xl mb-2">Nenhum registro encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    Não há registros para o prontuário informado.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Verifique se o número está correto ou consulte a recepção.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}