import { useQuery } from '@tanstack/react-query'
import { sessionQueries } from '@/entities/session'

export function HomePage() {
  const { data: user } = useQuery(sessionQueries.currentUser())

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-2">
      <h1 className="text-3xl font-semibold tracking-tight">
        Olá{user ? `, ${user.name}` : ''}.
      </h1>
      <p className="text-sm text-muted-foreground">Seu painel ainda está vazio.</p>
    </div>
  )
}
