import { Badge } from "@/components/ui/badge"
import { EntradaLEC } from "@/types/sgfc"
import { AlertTriangle, Heart, Scale } from "lucide-react"

interface PriorityBadgeProps {
  entrada: EntradaLEC;
  showScore?: boolean;
}

export function PriorityBadge({ entrada, showScore = false }: PriorityBadgeProps) {
  const getPriorityBadges = () => {
    const badges = []
    
    if (entrada.ordemJudicial) {
      badges.push(
        <Badge key="judicial" variant="legal" className="flex items-center gap-1">
          <Scale className="h-3 w-3" />
          Judicial
        </Badge>
      )
    }
    
    if (entrada.oncologico) {
      badges.push(
        <Badge key="oncologico" variant="oncology" className="flex items-center gap-1">
          <Heart className="h-3 w-3" />
          Oncológico
        </Badge>
      )
    }
    
    if (entrada.urgencia) {
      badges.push(
        <Badge key="urgencia" variant="urgent" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Urgente
        </Badge>
      )
    }
    
    if (badges.length === 0) {
      badges.push(<Badge key="normal" variant="secondary">Normal</Badge>)
    }
    
    if (showScore) {
      badges.push(
        <Badge key="score" variant="priority">
          Score: {entrada.scorePrioridade.toFixed(0)}
        </Badge>
      )
    }
    
    return badges
  }

  return (
    <div className="flex flex-wrap gap-1">
      {getPriorityBadges()}
    </div>
  )
}