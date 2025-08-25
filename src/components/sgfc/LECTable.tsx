import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EntradaLEC, FilterLEC } from "@/types/sgfc"
import { PriorityBadge } from "./PriorityBadge"
import { Edit, Trash2, Eye } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface LECTableProps {
  entradas: EntradaLEC[];
  filters?: FilterLEC;
  onEdit?: (entrada: EntradaLEC) => void;
  onRemove?: (entrada: EntradaLEC) => void;
  onView?: (entrada: EntradaLEC) => void;
  showActions?: boolean;
  showSensitiveData?: boolean; // Para controlar exibição de dados pessoais
}

export function LECTable({ 
  entradas, 
  filters,
  onEdit, 
  onRemove, 
  onView,
  showActions = true,
  showSensitiveData = true 
}: LECTableProps) {
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR })
  }

  if (!entradas.length) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">Nenhum paciente na fila no momento.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Espera Cirúrgica</CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Total: {entradas.length} pacientes</span>
          <span>Urgentes: {entradas.filter(e => e.urgencia).length}</span>
          <span>Oncológicos: {entradas.filter(e => e.oncologico).length}</span>
          <span>Judiciais: {entradas.filter(e => e.ordemJudicial).length}</span>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Pos.</TableHead>
              <TableHead>
                {showSensitiveData ? "Paciente" : "Prontuário"}
              </TableHead>
              <TableHead>Especialidade</TableHead>
              <TableHead>Procedimento</TableHead>
              <TableHead>Médico</TableHead>
              <TableHead>Data Entrada</TableHead>
              <TableHead>Dias Espera</TableHead>
              <TableHead>Prioridade</TableHead>
              {showActions && <TableHead className="w-32">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {entradas.map((entrada) => (
              <TableRow key={entrada.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  <Badge variant="outline">{entrada.posicao}º</Badge>
                </TableCell>
                <TableCell>
                  {showSensitiveData ? (
                    <div>
                      <p className="font-medium">{entrada.paciente.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {entrada.paciente.prontuario}
                      </p>
                    </div>
                  ) : (
                    <p className="font-mono">{entrada.paciente.prontuario}</p>
                  )}
                </TableCell>
                <TableCell>{entrada.especialidade.name}</TableCell>
                <TableCell>{entrada.procedimento.name}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{entrada.medico.name}</p>
                    <p className="text-sm text-muted-foreground">CRM: {entrada.medico.crm}</p>
                  </div>
                </TableCell>
                <TableCell>{formatDate(entrada.dataEntrada)}</TableCell>
                <TableCell>
                  <Badge variant={entrada.diasEspera > 90 ? "destructive" : "secondary"}>
                    {entrada.diasEspera} dias
                  </Badge>
                </TableCell>
                <TableCell>
                  <PriorityBadge entrada={entrada} showScore />
                </TableCell>
                {showActions && (
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView?.(entrada)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit?.(entrada)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemove?.(entrada)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}