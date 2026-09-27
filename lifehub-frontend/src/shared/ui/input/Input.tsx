import type { ComponentProps } from 'react'

export type InputProps = ComponentProps<'input'>

/**
 * Sem cor para comunicar estado: erro (aria-invalid) engrossa a borda para
 * preto; foco ganha outline preto; desabilitado vira fundo cinza apagado.
 */
const base =
  'h-10 w-full rounded-none border border-border bg-background px-3 text-sm text-foreground ' +
  'placeholder:text-muted-foreground transition-colors ' +
  'hover:border-gray-500 ' +
  'focus-visible:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ' +
  'aria-invalid:border-2 aria-invalid:border-foreground ' +
  'disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:hover:border-border'

export function Input({ className = '', type = 'text', ...props }: InputProps) {
  return <input type={type} className={`${base} ${className}`} {...props} />
}
