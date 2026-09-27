/**
 * Fonte unica dos caminhos da aplicacao. Router, middlewares e links leem
 * daqui — nenhuma string de rota solta pelo codigo.
 */
export const routerParams = {
  root: '/',
  auth: {
    root: '/auth',
    login: '/auth/login',
    register: '/auth/register',
  },
} as const
