import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  type IssuedToken,
  TokenIssuer,
  type TokenPayload,
} from '../../domain/services/token-issuer.js';

@Injectable()
export class JwtTokenIssuer implements TokenIssuer {
  constructor(private readonly jwt: JwtService) {}

  async issue(payload: TokenPayload): Promise<IssuedToken> {
    const value = await this.jwt.signAsync(payload);

    // A validade vem do proprio token assinado: quem consome (o cookie) expira
    // junto com o JWT, sem uma segunda fonte de verdade para o prazo.
    const { exp } = this.jwt.decode<{ exp: number }>(value);

    return { value, expiresAt: new Date(exp * 1000) };
  }
}
