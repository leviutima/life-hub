import { Injectable } from '@nestjs/common';
import type { CookieOptions, Request, Response } from 'express';
import { NodeEnv } from '../../../../shared/infra/config/env.schema.js';
import { EnvService } from '../../../../shared/infra/config/env.service.js';

export const ACCESS_TOKEN_COOKIE = 'lifehub_access_token';

/**
 * Unico lugar que sabe como o token trafega no HTTP. Controller grava/limpa,
 * guard le -- ninguem mais conhece nome ou flags do cookie.
 *
 * - httpOnly: JS do navegador nao le o token (XSS nao rouba a sessao)
 * - sameSite lax: o cookie nao vai em requisicoes disparadas por outros sites
 * - secure so em producao: em dev o front roda em http://localhost
 */
@Injectable()
export class AccessTokenCookie {
  constructor(private readonly env: EnvService) {}

  set(response: Response, token: string, expiresAt: Date): void {
    response.cookie(ACCESS_TOKEN_COOKIE, token, { ...this.options(), expires: expiresAt });
  }

  clear(response: Response): void {
    // clearCookie so apaga se path/domain/flags baterem com os do set
    response.clearCookie(ACCESS_TOKEN_COOKIE, this.options());
  }

  read(request: Request): string | undefined {
    const value: unknown = request.cookies?.[ACCESS_TOKEN_COOKIE];

    return typeof value === 'string' && value.length > 0 ? value : undefined;
  }

  private options(): CookieOptions {
    return {
      httpOnly: true,
      secure: this.env.get('NODE_ENV') === NodeEnv.production,
      sameSite: 'lax',
      path: '/',
    };
  }
}
