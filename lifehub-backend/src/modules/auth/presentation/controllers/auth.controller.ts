import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import type { AuthenticatedUser } from '../../../../shared/presentation/authenticated-user.js';
import { CurrentUser } from '../../../../shared/presentation/decorators/current-user.decorator.js';
import { Public } from '../../../../shared/presentation/decorators/public.decorator.js';
import { AuthenticateUserUseCase } from '../../application/use-cases/authenticate-user.use-case.js';
import { GetUserProfileUseCase } from '../../application/use-cases/get-user-profile.use-case.js';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case.js';
import { AccessTokenCookie } from '../cookies/access-token.cookie.js';
import { AuthenticateUserDto } from '../dto/authenticate-user.dto.js';
import { RegisterUserDto } from '../dto/register-user.dto.js';
import { UserPresenter, type UserHttpResponse } from '../presenters/user.presenter.js';

/**
 * O controller nao tem regra: valida entrada (DTO), chama o use case e
 * devolve o que o presenter permite. Toda decisao esta nas camadas de dentro.
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly authenticateUser: AuthenticateUserUseCase,
    private readonly getUserProfile: GetUserProfileUseCase,
    private readonly accessTokenCookie: AccessTokenCookie,
  ) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria uma conta' })
  async register(@Body() body: RegisterUserDto): Promise<UserHttpResponse> {
    const { user } = await this.registerUser.execute(body);

    return UserPresenter.toHttp(user);
  }

  /**
   * O token sai so no cookie httpOnly, nunca no body: se fosse devolvido no
   * JSON, o JS do front teria acesso a ele e o httpOnly nao serviria de nada.
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Autentica e grava o cookie de sessao' })
  async login(
    @Body() body: AuthenticateUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const { accessToken, expiresAt } = await this.authenticateUser.execute(body);

    this.accessTokenCookie.set(response, accessToken, expiresAt);
  }

  /** Publica de proposito: sair tem que funcionar mesmo com o token ja expirado. */
  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Encerra a sessao (apaga o cookie)' })
  logout(@Res({ passthrough: true }) response: Response): void {
    this.accessTokenCookie.clear(response);
  }

  @Get('me')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Perfil do usuario autenticado' })
  async me(@CurrentUser() current: AuthenticatedUser): Promise<UserHttpResponse> {
    const { user } = await this.getUserProfile.execute({ userId: current.id });

    return UserPresenter.toHttp(user);
  }
}
