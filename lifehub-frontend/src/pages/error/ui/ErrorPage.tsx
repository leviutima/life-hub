import { useRouteError } from 'react-router'
import { isNetworkError } from '@/shared/api'
import { Button } from '@/shared/ui'

/**
 * errorElement da raiz do router: qualquer erro de middleware ou de render
 * cai aqui em vez da tela padrao do React Router.
 */
export function ErrorPage() {
  const error = useRouteError()
  const offline = isNetworkError(error)

  if (import.meta.env.DEV) {
    console.error(error)
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="flex max-w-sm flex-col gap-4">
        <h1 className="text-2xl font-semibold">
          {offline ? 'Sem conexão com o servidor' : 'Algo deu errado'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {offline
            ? 'Não foi possível falar com a API. Verifique se ela está no ar e tente de novo.'
            : 'Um erro inesperado interrompeu esta página. Tente novamente.'}
        </p>
        {/* Recarregar refaz a navegacao inteira, incluindo os middlewares de sessao */}
        <Button className="self-start" onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </div>
    </main>
  )
}
