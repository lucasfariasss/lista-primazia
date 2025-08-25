import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Check, X, Loader2, AlertCircle, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useProntuarioValidation } from "@/hooks/useIncrementalData"

interface ProntuarioFieldProps {
  value: string
  onValueChange: (value: string) => void
  onValidPaciente: (paciente: any) => void
  error?: string
  disabled?: boolean
  label?: string
  placeholder?: string
  required?: boolean
}

export function ProntuarioField({
  value,
  onValueChange,
  onValidPaciente,
  error: externalError,
  disabled = false,
  label = "Prontuário do Paciente",
  placeholder = "Digite o número do prontuário",
  required = false
}: ProntuarioFieldProps) {
  const [inputValue, setInputValue] = useState(value)
  const { result, validateProntuario, clearValidation } = useProntuarioValidation()

  // Mask for digits only
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '') // Only digits
    setInputValue(rawValue)
    onValueChange(rawValue)
    
    // Clear validation when input changes
    if (result.isValid || result.error) {
      clearValidation()
    }
  }

  // Validate on blur
  const handleBlur = () => {
    if (inputValue.trim()) {
      validateProntuario(inputValue)
    }
  }

  // Manual validation trigger
  const handleValidateClick = () => {
    if (inputValue.trim()) {
      validateProntuario(inputValue)
    }
  }

  // Update parent when validation succeeds
  useEffect(() => {
    if (result.isValid && result.paciente) {
      onValidPaciente(result.paciente)
    }
  }, [result.isValid, result.paciente, onValidPaciente])

  // Determine status colors and icons
  const getStatusIcon = () => {
    if (result.loading) {
      return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
    }
    if (result.isValid) {
      return <Check className="h-4 w-4 text-success" />
    }
    if (result.error) {
      return <X className="h-4 w-4 text-destructive" />
    }
    return null
  }

  const getInputStyles = () => {
    if (externalError) return "border-destructive focus-visible:ring-destructive"
    if (result.error) return "border-destructive focus-visible:ring-destructive"
    if (result.isValid) return "border-success focus-visible:ring-success"
    return ""
  }

  const errorMessage = externalError || result.error

  return (
    <div className="space-y-2">
      <Label htmlFor="prontuario" className="flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            id="prontuario"
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            disabled={disabled || result.loading}
            className={cn("pr-10", getInputStyles())}
            maxLength={10}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {getStatusIcon()}
          </div>
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="default"
          onClick={handleValidateClick}
          disabled={!inputValue.trim() || result.loading || disabled}
          className="shrink-0"
        >
          {result.loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          <span className="sr-only">Validar prontuário</span>
        </Button>
      </div>

      {/* Status messages */}
      {errorMessage && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      {result.isValid && result.paciente && (
        <div className="flex items-center gap-2 p-3 bg-success/5 border border-success/20 rounded-md">
          <Check className="h-4 w-4 text-success" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-success">
              Paciente encontrado
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {result.paciente.nome}
              {result.paciente.phone && ` • ${result.paciente.phone}`}
            </p>
          </div>
        </div>
      )}

      {/* Helper text */}
      <p className="text-xs text-muted-foreground">
        Digite o número do prontuário e pressione Enter ou clique em validar para verificar o paciente
      </p>
    </div>
  )
}