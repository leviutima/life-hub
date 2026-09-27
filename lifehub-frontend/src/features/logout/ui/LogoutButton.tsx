import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { sessionApi } from '@/entities/session'
import { routerParams } from '@/shared/config'
import { Button, type ButtonProps } from '@/shared/ui'

export function LogoutButton(props: Omit<ButtonProps, 'onClick'>) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const logout = useMutation({
    mutationFn: sessionApi.logout,
    // onSettled, nao onSuccess: mesmo se a chamada falhar, o front esquece a
    // sessao. clear() apaga todo o cache -- nada do usuario anterior sobra.
    onSettled: async () => {
      queryClient.clear()
      await navigate(routerParams.auth.login, { replace: true })
    },
  })

  return (
    <Button
      variant="secondary"
      size="sm"
      disabled={logout.isPending}
      onClick={() => logout.mutate()}
      {...props}
    >
      {logout.isPending ? 'Saindo…' : 'Sair'}
    </Button>
  )
}
