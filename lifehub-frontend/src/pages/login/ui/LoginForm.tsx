import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { sessionApi, sessionQueries } from '@/entities/session'
import { getApiErrorMessage } from '@/shared/api'
import { routerParams } from '@/shared/config'
import { Alert, Button, Field } from '@/shared/ui'
import { loginSchema, type LoginFormValues } from '../model/login-schema'

export function LoginForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const login = useMutation({
    mutationFn: sessionApi.login,
    onSuccess: async () => {
      // O cache ainda diz "nao logado" (null): descarta para o middleware
      // da raiz buscar o /auth/me de novo, agora com o cookie.
      queryClient.removeQueries({ queryKey: sessionQueries.all() })
      await navigate(routerParams.root, { replace: true })
    },
  })

  return (
    <form
      noValidate
      className="flex flex-col gap-4"
      onSubmit={handleSubmit((values) => login.mutate(values))}
    >
      {login.isError && (
        <Alert>{getApiErrorMessage(login.error, 'Não foi possível entrar. Tente novamente.')}</Alert>
      )}

      <Field
        label="E-mail"
        type="email"
        autoComplete="email"
        placeholder="voce@exemplo.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <Field
        label="Senha"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />

      <Button type="submit" size="lg" className="mt-2" disabled={login.isPending}>
        {login.isPending ? 'Entrando…' : 'Entrar'}
      </Button>
    </form>
  )
}
