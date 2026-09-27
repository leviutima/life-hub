import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_ROUTE = 'lifehub:isPublicRoute';

/** Libera a rota do JwtAuthGuard global (login, cadastro, health). */
export const Public = (): MethodDecorator & ClassDecorator =>
  SetMetadata(IS_PUBLIC_ROUTE, true);
