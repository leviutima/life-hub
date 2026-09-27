import { Link } from 'react-router'
import { RegisterForm } from './RegisterForm'
import { routerParams } from '@/shared/config'

export function RegisterPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Criar conta</h1>
        <p className="text-sm text-muted-foreground">
          Comece a acompanhar suas finanças, rotina e hábitos.
        </p>
      </div>

      <RegisterForm />

      <p className="text-sm text-muted-foreground">
        Já tem conta?{' '}
        <Link
          to={routerParams.auth.login}
          className="font-medium text-foreground underline underline-offset-4 hover:no-underline"
        >
          Entrar
        </Link>
      </p>
    </div>
  )
}
