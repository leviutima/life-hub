import { createBrowserRouter, Navigate } from 'react-router'
import { ErrorPage } from '@/pages/error'
import { HomePage } from '@/pages/home'
import { LoginPage } from '@/pages/login'
import { RegisterPage } from '@/pages/register'
import { routerParams } from '@/shared/config'
import { AppLayout } from '../layouts/AppLayout'
import { AuthLayout } from '../layouts/AuthLayout'
import { requireAuth } from './middlewares/require-auth'
import { requireGuest } from './middlewares/require-guest'

/**
 * Uma rota raiz sem path so para segurar o errorElement: erro de qualquer
 * middleware ou pagina abaixo dela sobe ate aqui.
 *
 * Dentro, duas arvores irmas, cada uma com seu middleware e seu layout:
 * - raiz (/): aplicacao, exige sessao
 * - /auth: telas publicas, exigem NAO ter sessao
 * O middleware roda antes do render, entao a tela errada nunca pisca.
 */
export const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      {
        path: routerParams.root,
        middleware: [requireAuth],
        element: <AppLayout />,
        children: [{ index: true, element: <HomePage /> }],
      },
      {
        path: routerParams.auth.root,
        middleware: [requireGuest],
        element: <AuthLayout />,
        children: [
          { index: true, element: <Navigate to={routerParams.auth.login} replace /> },
          { path: routerParams.auth.login, element: <LoginPage /> },
          { path: routerParams.auth.register, element: <RegisterPage /> },
        ],
      },
      { path: '*', element: <Navigate to={routerParams.root} replace /> },
    ],
  },
])
