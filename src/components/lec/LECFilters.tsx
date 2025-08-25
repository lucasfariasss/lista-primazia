import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Filter, Search } from "lucide-react"
import { FilterLEC } from "@/types/sgfc"
import { useEspecialidades, useProcedimentos, useProfissionais } from "@/hooks/useSupabaseData"

interface LECFiltersProps {
  filters: FilterLEC
  onFiltersChange: (filters: FilterLEC) => void
  activeFiltersCount: number
}

const situacaoLabels = {
  'CA': 'Consulta Agendada',
  'AE': 'Exames Pendentes', 
  'DP': 'Documentos Pendentes',
  'PP': 'Pronto para Cirurgia',
  'CNR': 'Contato Não Realizado',
  'T1F': 'Tentativa 1 Falhada',
  'T2F': 'Tentativa 2 Falhada', 
  'T3F': 'Tentativa 3 Falhada',
  'CRS': 'Contato Realizado com Sucesso'
}

const prioridadeLabels = {
  'ONC': 'Oncológico',
  'BRE': 'Com Brevidade',
  'SEM': 'Sem Brevidade'
}

export function LECFilters({ filters, onFiltersChange, activeFiltersCount }: LECFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { especialidades } = useEspecialidades()
  const { procedimentos } = useProcedimentos()
  const { profissionais } = useProfissionais()

  const clearFilters = () => {
    onFiltersChange({})
  }

  const updateFilter = (key: keyof FilterLEC, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined
    })
  }

  const procedimentosFiltrados = filters.especialidadeId 
    ? procedimentos.filter(p => p.COD_ESPECIALIDADE_FK?.toString() === filters.especialidadeId)
    : procedimentos

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros da Lista de Espera
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount} ativo{activeFiltersCount > 1 ? 's' : ''}</Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Recolher' : 'Expandir'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Especialidade */}
            <div className="space-y-2">
              <Label htmlFor="especialidade">Especialidade</Label>
              <Select 
                value={filters.especialidadeId || ''} 
                onValueChange={(value) => {
                  updateFilter('especialidadeId', value)
                  // Limpar procedimento se mudar especialidade
                  if (filters.procedimentoId) {
                    updateFilter('procedimentoId', '')
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as especialidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as especialidades</SelectItem>
                  {especialidades.map((esp) => (
                    <SelectItem key={esp.COD_ESPECIALIDADE} value={esp.COD_ESPECIALIDADE.toString()}>
                      {esp.NOME_ESPECIALIDADE}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Procedimento */}
            <div className="space-y-2">
              <Label htmlFor="procedimento">Procedimento</Label>
              <Select 
                value={filters.procedimentoId || ''} 
                onValueChange={(value) => updateFilter('procedimentoId', value)}
                disabled={!filters.especialidadeId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os procedimentos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os procedimentos</SelectItem>
                  {procedimentosFiltrados.map((proc) => (
                    <SelectItem key={proc.COD_PROCEDIMENTO} value={proc.COD_PROCEDIMENTO.toString()}>
                      {proc.PROCEDIMENTO}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Médico */}
            <div className="space-y-2">
              <Label htmlFor="medico">Médico Responsável</Label>
              <Select 
                value={filters.medicoId || ''} 
                onValueChange={(value) => updateFilter('medicoId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os médicos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os médicos</SelectItem>
                  {profissionais.map((prof) => (
                    <SelectItem key={prof.MATRICULA} value={prof.MATRICULA.toString()}>
                      {prof.NOME_PROFISSIONAL}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Prioridade */}
            <div className="space-y-2">
              <Label htmlFor="prioridade">Prioridade</Label>
              <Select 
                value={filters.prioridade || ''} 
                onValueChange={(value) => updateFilter('prioridade', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as prioridades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as prioridades</SelectItem>
                  {Object.entries(prioridadeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Situação */}
            <div className="space-y-2">
              <Label htmlFor="situacao">Situação</Label>
              <Select 
                value={filters.situacao || ''} 
                onValueChange={(value) => updateFilter('situacao', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as situações" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as situações</SelectItem>
                  {Object.entries(situacaoLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Switches para filtros booleanos */}
          <div className="flex flex-wrap gap-6 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Switch 
                id="ativo" 
                checked={filters.ativo === true}
                onCheckedChange={(checked) => updateFilter('ativo', checked ? true : undefined)}
              />
              <Label htmlFor="ativo">Apenas ativos</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="ordemJudicial" 
                checked={filters.ordemJudicial === true}
                onCheckedChange={(checked) => updateFilter('ordemJudicial', checked ? true : undefined)}
              />
              <Label htmlFor="ordemJudicial">Com ordem judicial</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="oncologico" 
                checked={filters.oncologico === true}
                onCheckedChange={(checked) => updateFilter('oncologico', checked ? true : undefined)}
              />
              <Label htmlFor="oncologico">Oncológico</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="urgencia" 
                checked={filters.urgencia === true}
                onCheckedChange={(checked) => updateFilter('urgencia', checked ? true : undefined)}
              />
              <Label htmlFor="urgencia">Com brevidade</Label>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}