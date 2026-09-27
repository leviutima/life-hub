import type { ComponentProps } from 'react'

export type AlertProps = ComponentProps<'div'>

/**
 * Erro que nao pertence a um campo (credenciais invalidas, API fora).
 * Mesma linguagem do erro de campo: borda de 2px e peso, sem cor.
 */
export function Alert({ className = '', ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={`border-2 border-foreground px-3 py-2 text-sm font-medium text-foreground ${className}`}
      {...props}
    />
  )
}
