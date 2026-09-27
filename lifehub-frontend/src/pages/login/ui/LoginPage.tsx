import { Link } from 'react-router'
import { LoginForm } from './LoginForm'
import { routerParams } from '@/shared/config'

export function LoginPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Entrar</h1>
        <p className="text-sm text-muted-foreground">Acesse sua conta para continuar.</p>
      </div>

      <LoginForm />

      <p className="text-sm text-muted-foreground">
        Ainda não tem conta?{' '}
        <Link
          to={routerParams.auth.register}
          className="font-medium text-foreground underline underline-offset-4 hover:no-underline"
        >
          Criar conta
        </Link>
      </p>
    </div>
  )
}
