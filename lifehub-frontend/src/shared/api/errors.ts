import { isAxiosError } from 'axios'

/**
 * Formato de erro do backend: `DomainExceptionFilter` devolve message string;
 * o ValidationPipe do Nest devolve message como lista.
 */
interface ApiErrorBody {
  statusCode?: number
  code?: string
  message?: string | string[]
}

/** A requisicao saiu mas nao voltou resposta: API fora do ar, DNS, CORS, rede. */
export function isNetworkError(error: unknown): boolean {
  return isAxiosError(error) && !error.response
}

export function getApiErrorStatus(error: unknown): number | undefined {
  return isAxiosError(error) ? error.response?.status : undefined
}

/** Mensagem pronta para a UI: a do backend quando existir, senao o fallback. */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isNetworkError(error)) {
    return 'Sem conexão com o servidor. Tente novamente.'
  }

  if (isAxiosError<ApiErrorBody>(error)) {
    const message = error.response?.data?.message

    if (Array.isArray(message)) return message[0] ?? fallback
    if (typeof message === 'string') return message
  }

  return fallback
}
