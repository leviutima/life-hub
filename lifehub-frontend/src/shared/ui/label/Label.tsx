import type { ComponentProps } from 'react'

export type LabelProps = ComponentProps<'label'>

/** htmlFor vem por props: o Label nao sabe qual campo descreve. */
export function Label({ className = '', ...props }: LabelProps) {
  return <label className={`text-sm font-medium text-foreground ${className}`} {...props} />
}
