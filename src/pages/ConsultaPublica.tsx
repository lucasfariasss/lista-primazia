import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Users, Clock, FileText, LogIn, Shield } from "lucide-react"
import { PriorityBadge } from "@/components/sgfc/PriorityBadge"
import { Link } from "react-router-dom"

// Mock para consulta pública - resultados anonimizados
interface ResultadoConsulta {
  prontuario: string
  especialidade: string
  procedimento: string
  posicao: number
  diasEspera: number
  urgencia: boolean
  oncologico: boolean
  ordemJudicial: boolean
}

const mockResultados: ResultadoConsulta[] = [
  {
    prontuario: "001234",
    especialidade: "Ortopedia",
    procedimento: "Artroplastia total do joelho",
    posicao: 1,
    diasEspera: 45,
    urgencia: false,
    oncologico: false,
    ordemJudicial: true
  },
  {
    prontuario: "001234", 
    especialidade: "Cardiologia",
    procedimento: "Revascularização miocárdica",
    posicao: 3,
    diasEspera: 32,
    urgencia: true,
    oncologico: false,
    ordemJudicial: false
  }
]

export default function ConsultaPublica() {
  const [prontuario, setProntuario] = useState("")
  const [resultados, setResultados] = useState<ResultadoConsulta[]>([])
  const [loading, setLoading] = useState(false)

  const handleBuscar = async () => {
    if (!prontuario.trim()) return

    setLoading(true)
    
    // Simular consulta na API
    setTimeout(() => {
      if (prontuario === "001234") {
        setResultados(mockResultados)
      } else {
        setResultados([])
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-light">
      {/* Header público */}
      <header className="bg-white border-b border-border shadow-card-medical">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-primary">SGFC - HULW</h1>
                <p className="text-sm text-muted-foreground">Consulta Pública da Lista de Espera Cirúrgica</p>
              </div>
            </div>
            
            {/* Link para funcionários */}
            <Link to="/login">
              <Button variant="outline" size="sm" className="gap-2">
                <Shield className="h-4 w-4" />
                Acesso para Funcionários
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="space-y-8">
          {/* Seção de busca */}
          <Card className="border-primary/20 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader className="text-center pb-6 bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardTitle className="text-2xl text-primary flex items-center justify-center gap-2">
                <Search className="h-6 w-6" />
                Consultar Posição na Fila
              </CardTitle>
              <CardDescription className="text-base max-w-2xl mx-auto">
                Digite seu número de prontuário para consultar sua posição na lista de espera cirúrgica. 
                As informações são atualizadas em tempo real e seguem a Lei Geral de Proteção de Dados (LGPD).
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex gap-3 max-w-md mx-auto">
                <Input
                  type="text"
                  placeholder="000000"
                  value={prontuario}
                  onChange={(e) => setProntuario(e.target.value)}
                  className="text-center text-lg font-mono bg-muted/30 border-primary/20 focus:border-primary"
                  maxLength={6}
                />
                <Button 
                  onClick={handleBuscar} 
                  className="bg-medical hover:bg-medical/90 px-8 shadow-md"
                  disabled={!prontuario.trim()}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Consultar
                </Button>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Esta consulta é segura e não expõe dados pessoais sensíveis
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Resultados */}
          {resultados.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <Users className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-primary">
                  Suas Posições na Fila Cirúrgica
                </h2>
              </div>
              
              <div className="grid gap-4">
                {resultados.map((resultado, index) => (
                  <Card key={index} className="shadow-lg border-l-4 border-l-primary bg-white/90 backdrop-blur">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                              Prontuário: {prontuario}
                            </Badge>
                          </div>
                          <p className="font-semibold text-lg text-primary">{resultado.especialidade}</p>
                          <p className="text-muted-foreground">{resultado.procedimento}</p>
                        </div>
                        <div className="text-right bg-gradient-to-br from-primary/10 to-secondary/10 p-4 rounded-lg">
                          <div className="text-3xl font-bold text-primary">{resultado.posicao}°</div>
                          <p className="text-sm text-muted-foreground font-medium">posição na fila</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            <span className="font-medium">{resultado.diasEspera} dias</span> na fila de espera
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {resultado.ordemJudicial && (
                            <Badge variant="outline" className="text-xs bg-legal/10 text-legal border-legal/20">
                              Judicial
                            </Badge>
                          )}
                          {resultado.oncologico && (
                            <Badge variant="outline" className="text-xs bg-oncologic/10 text-oncologic border-oncologic/20">
                              Oncológico
                            </Badge>
                          )}
                          {resultado.urgencia && (
                            <Badge variant="outline" className="text-xs bg-urgent/10 text-urgent border-urgent/20">
                              Urgente
                            </Badge>
                          )}
                          {!resultado.urgencia && !resultado.oncologico && !resultado.ordemJudicial && (
                            <Badge variant="secondary" className="text-xs">
                              Normal
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card className="bg-muted/30 border-dashed">
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    <strong>Importante:</strong> A posição na fila é calculada automaticamente com base em critérios médicos e legais. 
                    Para mais informações sobre seu procedimento, entre em contato com o hospital.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Aviso de Privacidade */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary text-lg">
                <Shield className="h-5 w-5" />
                Proteção de Dados e Transparência
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong>🔒 Privacidade:</strong> Esta consulta está em conformidade com a LGPD. 
                  Apenas informações não sensíveis são exibidas publicamente.
                </p>
                <p>
                  <strong>🎯 Transparência:</strong> A ordem da fila é calculada automaticamente 
                  com base em critérios médicos objetivos e determinações judiciais.
                </p>
                <p>
                  <strong>⚖️ Justiça:</strong> O sistema garante tratamento equitativo a todos os pacientes, 
                  priorizando casos urgentes, oncológicos e com ordem judicial.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}