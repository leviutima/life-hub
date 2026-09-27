import { Injectable } from '@nestjs/common';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error.js';
import { Hasher } from '../../domain/services/hasher.js';
import { TokenIssuer } from '../../domain/services/token-issuer.js';
import { UserRepository } from '../../domain/repositories/user.repository.js';

export interface AuthenticateUserInput {
  email: string;
  password: string;
}

export interface AuthenticateUserOutput {
  accessToken: string;
  expiresAt: Date;
}

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: Hasher,
    private readonly tokens: TokenIssuer,
  ) {}

  async execute(input: AuthenticateUserInput): Promise<AuthenticateUserOutput> {
    const user = await this.users.findByEmail(input.email.trim().toLowerCase());

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordMatches = await this.hasher.compare(input.password, user.passwordHash);

    if (!passwordMatches) {
      throw new InvalidCredentialsError();
    }

    const token = await this.tokens.issue({ sub: user.id, email: user.email });

    return { accessToken: token.value, expiresAt: token.expiresAt };
  }
}
