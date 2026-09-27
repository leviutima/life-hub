import { redirect, type MiddlewareFunction } from 'react-router'
import { sessionQueries } from '@/entities/session'
import { queryClient } from '@/shared/api'
import { routerParams } from '@/shared/config'

/** Rotas privadas: sem sessao valida no backend, manda para o login antes de renderizar. */
export const requireAuth: MiddlewareFunction = async () => {
  const user = await queryClient.fetchQuery(sessionQueries.currentUser())

  if (!user) {
    throw redirect(routerParams.auth.login)
  }
}
