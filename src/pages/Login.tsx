import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Lock, User, UserPlus } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

export default function Login() {
  const navigate = useNavigate()
  const { signIn, signUp, user } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate("/")
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password)
        if (error) {
          toast.error(error.message)
        } else {
          toast.success("Conta criada! Verifique seu email para confirmar.")
        }
      } else {
        const { error } = await signIn(email, password)
        if (error) {
          toast.error(error.message)
        } else {
          toast.success("Login realizado com sucesso!")
          navigate("/")
        }
      }
    } catch (error) {
      toast.error("Erro inesperado. Tente novamente.")
    } finally {
      setLoading(false)
    }
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
              {isSignUp ? <UserPlus className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
              {isSignUp ? "Criar Conta" : "Acesso ao Sistema"}
            </CardTitle>
            <CardDescription>
              {isSignUp ? "Crie sua conta institucional" : "Entre com suas credenciais institucionais"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
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
                {loading 
                  ? (isSignUp ? "Criando conta..." : "Entrando...") 
                  : (isSignUp ? "Criar Conta" : "Entrar")
                }
              </Button>
            </form>

            <div className="border-t border-border pt-4 space-y-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => setIsSignUp(!isSignUp)}
                disabled={loading}
              >
                {isSignUp ? "Já tem conta? Fazer login" : "Não tem conta? Criar uma"}
              </Button>

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