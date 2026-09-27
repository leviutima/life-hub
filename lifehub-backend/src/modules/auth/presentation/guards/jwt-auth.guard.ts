import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import type { AuthenticatedUser } from '../../../../shared/presentation/authenticated-user.js';
import { IS_PUBLIC_ROUTE } from '../../../../shared/presentation/decorators/public.decorator.js';
import type { TokenPayload } from '../../domain/services/token-issuer.js';
import { AccessTokenCookie } from '../cookies/access-token.cookie.js';

/**
 * Registrado como APP_GUARD: toda rota exige token, e a excecao e explicita
 * via @Public(). Fechado por padrao -- esquecer o decorator nao abre buraco.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly reflector: Reflector,
    private readonly accessTokenCookie: AccessTokenCookie,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_ROUTE, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthenticatedUser }>();

    const token = this.accessTokenCookie.read(request);

    if (!token) {
      throw new UnauthorizedException('Token de acesso ausente.');
    }

    try {
      const payload = await this.jwt.verifyAsync<TokenPayload>(token);

      request.user = { id: payload.sub, email: payload.email };

      return true;
    } catch {
      throw new UnauthorizedException('Token de acesso invalido ou expirado.');
    }
  }
}
