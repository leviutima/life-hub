export interface TokenPayload {
  sub: string;
  email: string;
}

export interface IssuedToken {
  value: string;
  expiresAt: Date;
}

/** Porta de emissao de token -- o dominio nao sabe que existe JWT. */
export abstract class TokenIssuer {
  abstract issue(payload: TokenPayload): Promise<IssuedToken>;
}
