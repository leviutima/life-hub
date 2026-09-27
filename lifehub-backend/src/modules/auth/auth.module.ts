import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, type JwtSignOptions } from '@nestjs/jwt';
import { EnvService } from '../../shared/infra/config/env.service.js';
import { PrismaModule } from '../../shared/infra/database/prisma/prisma.module.js';
import { AuthenticateUserUseCase } from './application/use-cases/authenticate-user.use-case.js';
import { GetUserProfileUseCase } from './application/use-cases/get-user-profile.use-case.js';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case.js';
import { UserRepository } from './domain/repositories/user.repository.js';
import { Hasher } from './domain/services/hasher.js';
import { TokenIssuer } from './domain/services/token-issuer.js';
import { BcryptHasher } from './infra/cryptography/bcrypt-hasher.js';
import { JwtTokenIssuer } from './infra/cryptography/jwt-token-issuer.js';
import { PrismaUserRepository } from './infra/database/prisma/prisma-user.repository.js';
import { AccessTokenCookie } from './presentation/cookies/access-token.cookie.js';
import { AuthController } from './presentation/controllers/auth.controller.js';
import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard.js';

/**
 * Aqui e o unico lugar que amarra porta -> implementacao. As camadas de dentro
 * (domain, application) seguem sem saber que existe Prisma, bcrypt ou JWT.
 */
@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      inject: [EnvService],
      useFactory: (env: EnvService) => ({
        secret: env.get('JWT_SECRET'),
        signOptions: {
          // JWT_EXPIRES_IN e validado como string no EnvSchema; o tipo de expiresIn
          // e o literal do 'ms' ('7d', '15m'...), que nao da para expressar no env.
          expiresIn: env.get('JWT_EXPIRES_IN') as JwtSignOptions['expiresIn'],
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    AuthenticateUserUseCase,
    GetUserProfileUseCase,
    AccessTokenCookie,
    { provide: UserRepository, useClass: PrismaUserRepository },
    { provide: Hasher, useClass: BcryptHasher },
    { provide: TokenIssuer, useClass: JwtTokenIssuer },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
  exports: [UserRepository],
})
export class AuthModule {}
