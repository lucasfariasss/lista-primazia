import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, Eye, Shield } from "lucide-react"
import { LECTable } from "@/components/sgfc/LECTable"
import { EntradaLEC } from "@/types/sgfc"

// Mock para consulta pública (dados anonimizados)
const mockConsultaResult: EntradaLEC[] = [
  {
    id: "1",
    pacienteId: "p1",
    paciente: {
      id: "p1",
      prontuario: "001234",
      name: "Paciente ***",
      cpf: "***.***.***-**",
      birthDate: "****-**-**",
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
  }
]

export default function ConsultaPublica() {
  const [prontuario, setProntuario] = useState("")
  const [resultado, setResultado] = useState<EntradaLEC[]>([])
  const [loading, setLoading] = useState(false)
  const [consultaRealizada, setConsultaRealizada] = useState(false)

  const handleConsulta = async () => {
    if (!prontuario.trim()) {
      return
    }

    setLoading(true)
    
    // Simular consulta na API
    setTimeout(() => {
      if (prontuario === "001234") {
        setResultado(mockConsultaResult)
      } else {
        setResultado([])
      }
      setConsultaRealizada(true)
      setLoading(false)
    }, 1000)
  }

  const handleExportarPDF = () => {
    // TODO: Implementar geração de PDF público (anonimizado)
    console.log("Exportar fila pública em PDF")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Consulta Pública</h1>
        <p className="text-muted-foreground">
          Consulte sua posição na fila de espera cirúrgica de forma transparente e segura
        </p>
      </div>

      {/* Aviso de Privacidade */}
      <Card className="border-primary/20 bg-primary-light/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Shield className="h-5 w-5" />
            Proteção de Dados Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Esta consulta está em conformidade com a LGPD. Apenas o número do prontuário 
            é necessário para visualizar sua posição na fila. Nenhum dado pessoal 
            identificável será exibido publicamente.
          </p>
        </CardContent>
      </Card>

      {/* Formulário de Consulta */}
      <Card>
        <CardHeader>
          <CardTitle>Consultar Posição na Fila</CardTitle>
          <CardDescription>
            Digite seu número de prontuário para consultar em quais filas você está cadastrado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Número do prontuário (ex: 001234)"
              value={prontuario}
              onChange={(e) => setProntuario(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleConsulta()}
              className="flex-1"
            />
            <Button 
              onClick={handleConsulta}
              disabled={loading || !prontuario.trim()}
              variant="medical"
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
        </CardContent>
      </Card>

      {/* Resultado da Consulta */}
      {consultaRealizada && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado da Consulta</CardTitle>
            <CardDescription>
              Prontuário: {prontuario}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resultado.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Você está cadastrado em {resultado.length} fila(s) de espera
                  </p>
                  <Button variant="outline" size="sm" onClick={handleExportarPDF}>
                    <FileText className="h-4 w-4 mr-2" />
                    Comprovante PDF
                  </Button>
                </div>
                
                <LECTable
                  entradas={resultado}
                  showActions={false}
                  showSensitiveData={false}
                />
              </div>
            ) : (
              <div className="text-center py-8">
                <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-lg mb-2">Nenhum registro encontrado</h3>
                <p className="text-muted-foreground">
                  Não há registros ativos para o prontuário informado.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Lista Pública Geral */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Fila Geral (Anonimizada)</CardTitle>
            <CardDescription>
              Visualização transparente da fila de espera cirúrgica
            </CardDescription>
          </div>
          <Button variant="outline" onClick={handleExportarPDF}>
            <FileText className="h-4 w-4 mr-2" />
            PDF Público
          </Button>
        </CardHeader>
        <CardContent>
          <LECTable
            entradas={[
              ...mockConsultaResult,
              // Adicionar mais entradas mockadas anonimizadas
            ]}
            showActions={false}
            showSensitiveData={false}
          />
        </CardContent>
      </Card>
    </div>
  )
}