import { useId } from 'react'
import { Input, type InputProps } from '../input/Input'
import { Label } from '../label/Label'

export interface FieldProps extends InputProps {
  label: string
  /** Texto de apoio, some quando ha erro */
  hint?: string
  error?: string
}

/**
 * Label + Input + mensagem, ja ligados por acessibilidade: o label aponta
 * para o input (htmlFor/id) e a mensagem e anunciada pelo leitor de tela
 * (aria-describedby). Formularios usam Field; Input/Label sao as pecas soltas.
 */
export function Field({ label, hint, error, id, className = '', ...inputProps }: FieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const messageId = `${inputId}-message`
  const message = error ?? hint

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <Label htmlFor={inputId}>{label}</Label>
      <Input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        {...inputProps}
      />
      {message && (
        <p
          id={messageId}
          // erro se diferencia pelo peso e pelo prefixo, nao por cor
          className={error ? 'text-xs font-semibold text-foreground' : 'text-xs text-muted-foreground'}
          role={error ? 'alert' : undefined}
        >
          {error ? `— ${error}` : hint}
        </p>
      )}
    </div>
  )
}
