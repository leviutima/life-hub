import { redirect, type MiddlewareFunction } from 'react-router'
import { sessionQueries } from '@/entities/session'
import { queryClient } from '@/shared/api'
import { routerParams } from '@/shared/config'

/** Rotas de auth: quem ja esta logado nao ve o login, vai para a raiz. */
export const requireGuest: MiddlewareFunction = async () => {
  const user = await queryClient.fetchQuery(sessionQueries.currentUser())

  if (user) {
    throw redirect(routerParams.root)
  }
}
