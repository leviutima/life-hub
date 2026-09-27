import { useQuery } from '@tanstack/react-query'
import { Outlet } from 'react-router'
import { sessionQueries } from '@/entities/session'
import { LogoutButton } from '@/features/logout'

/**
 * Moldura da area logada. O requireAuth ja carregou o usuario no cache antes
 * deste render, entao o useQuery aqui le do cache, sem novo request.
 */
export function AppLayout() {
  const { data: user } = useQuery(sessionQueries.currentUser())

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <span className="text-sm font-semibold tracking-tight">life-hub</span>

        <div className="flex items-center gap-4">
          {user && <span className="text-sm text-muted-foreground">{user.email}</span>}
          <LogoutButton />
        </div>
      </header>

      <main className="flex-1 px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
