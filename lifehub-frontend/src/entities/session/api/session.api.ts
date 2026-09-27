import { isAxiosError } from 'axios'
import { queryOptions } from '@tanstack/react-query'
import { httpClient } from '@/shared/api'

export interface SessionUser {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface LoginBody {
  email: string
  password: string
}

export interface RegisterBody {
  name: string
  email: string
  password: string
}

/**
 * Com cookie httpOnly o JS nao sabe se ha sessao: quem responde e o backend.
 * 401 nao e erro aqui, e a resposta "nao logado" -- vira null.
 * Qualquer outra falha (API fora, 500) continua sendo erro de verdade.
 */
async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const { data } = await httpClient.get<SessionUser>('/auth/me')

    return data
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return null
    }

    throw error
  }
}

/**
 * Transporte puro: so fala com a API. O que fazer depois (invalidar cache,
 * navegar) e decisao de quem chama -- as features.
 */
export const sessionApi = {
  /** 204: o backend grava o cookie de sessao, nao ha body. */
  async login(body: LoginBody): Promise<void> {
    await httpClient.post('/auth/login', body)
  },

  async register(body: RegisterBody): Promise<SessionUser> {
    const { data } = await httpClient.post<SessionUser>('/auth/register', body)

    return data
  },

  /** 204: o backend apaga o cookie. */
  async logout(): Promise<void> {
    await httpClient.post('/auth/logout')
  },
}

export const sessionQueries = {
  all: () => ['session'] as const,
  currentUser: () =>
    queryOptions({
      queryKey: [...sessionQueries.all(), 'current-user'],
      queryFn: getCurrentUser,
      // Navegar entre paginas nao refaz o /auth/me a cada clique.
      // Login/logout devem invalidar sessionQueries.all().
      staleTime: 5 * 60 * 1000,
      retry: false,
    }),
}
