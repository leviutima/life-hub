import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { sessionApi, sessionQueries } from '@/entities/session'
import { getApiErrorMessage, getApiErrorStatus } from '@/shared/api'
import { routerParams } from '@/shared/config'
import { Alert, Button, Field } from '@/shared/ui'
import {
  PASSWORD_HINT,
  registerSchema,
  type RegisterFormValues,
} from '../model/register-schema'

export function RegisterForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const signUp = useMutation({
    // Cadastro nao abre sessao no backend: loga logo em seguida com as
    // mesmas credenciais para a pessoa nao digitar tudo de novo.
    mutationFn: async ({ name, email, password }: RegisterFormValues) => {
      await sessionApi.register({ name, email, password })
      await sessionApi.login({ email, password })
    },
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: sessionQueries.all() })
      await navigate(routerParams.root, { replace: true })
    },
    onError: (error) => {
      // E-mail em uso e problema de um campo: aponta o erro nele
      if (getApiErrorStatus(error) === 409) {
        setError('email', { message: getApiErrorMessage(error, 'Este e-mail já está em uso.') })
      }
    },
  })

  const formError =
    signUp.isError && getApiErrorStatus(signUp.error) !== 409
      ? getApiErrorMessage(signUp.error, 'Não foi possível criar a conta. Tente novamente.')
      : null

  return (
    <form
      noValidate
      className="flex flex-col gap-4"
      onSubmit={handleSubmit((values) => signUp.mutate(values))}
    >
      {formError && <Alert>{formError}</Alert>}

      <Field
        label="Nome"
        autoComplete="name"
        placeholder="Como quer ser chamado"
        error={errors.name?.message}
        {...register('name')}
      />
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
        autoComplete="new-password"
        placeholder="••••••••"
        hint={PASSWORD_HINT}
        error={errors.password?.message}
        {...register('password')}
      />
      <Field
        label="Confirmar senha"
        type="password"
        autoComplete="new-password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <Button type="submit" size="lg" className="mt-2" disabled={signUp.isPending}>
        {signUp.isPending ? 'Criando conta…' : 'Criar conta'}
      </Button>
    </form>
  )
}
