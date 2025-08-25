import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Lock, User } from "lucide-react"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simular login
    setTimeout(() => {
      setLoading(false)
      navigate("/")
    }, 1000)
  }

  const quickLogin = (role: string) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate("/")
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-light flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Activity className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">SGFC</h1>
          <p className="text-lg text-primary font-medium">Sistema de Gestão de Fila Cirúrgica</p>
          <p className="text-sm text-muted-foreground">Hospital Universitário Lauro Wanderley</p>
        </div>

        {/* Formulário de Login */}
        <Card className="shadow-medical">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Acesso ao Sistema
            </CardTitle>
            <CardDescription>
              Entre com suas credenciais institucionais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Institucional</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@hulw.ufpb.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                variant="medical"
                disabled={loading}
              >
                {loading ? "Autenticando..." : "Entrar no Sistema"}
              </Button>
            </form>

            {/* Acesso rápido para demonstração */}
            <div className="border-t border-border pt-4 space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                Acesso rápido para demonstração:
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin("nir")}
                  disabled={loading}
                >
                  <User className="h-4 w-4 mr-1" />
                  NIR
                </Button>
                
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={() => quickLogin("medico")}
                  disabled={loading}
                >
                  <User className="h-4 w-4 mr-1" />
                  Médico
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => navigate("/consulta")}
              >
                Consulta Pública (sem login)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Informações adicionais */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <Badge variant="outline" className="bg-primary-light/20">
              LGPD Compliant
            </Badge>
            <Badge variant="outline" className="bg-success/10 text-success">
              Sistema Seguro
            </Badge>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Este sistema está em conformidade com a Lei Geral de Proteção de Dados (LGPD)
            e utiliza criptografia para proteger informações sensíveis.
          </p>
        </div>
      </div>
    </div>
  )
}