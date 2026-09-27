import { randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/app.setup.js';
import { ACCESS_TOKEN_COOKIE } from '../src/modules/auth/presentation/cookies/access-token.cookie.js';
import { PrismaService } from '../src/shared/infra/database/prisma/prisma.service.js';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const email = `e2e-${randomUUID()}@lifehub.dev`;
  const password = 'senha-bem-secreta';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();

    app = configureApp(moduleRef.createNestApplication());
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email } });
    await app.close();
  });

  it('registra, autentica via cookie, devolve o perfil e encerra a sessao', async () => {
    // agent guarda os cookies entre requisicoes, como o navegador faz
    const agent = request.agent(app.getHttpServer());

    const register = await agent
      .post('/auth/register')
      .send({ name: 'Teste E2E', email, password })
      .expect(201);

    expect(register.body).toMatchObject({ name: 'Teste E2E', email });
    expect(register.body.passwordHash).toBeUndefined();

    const session = await agent.post('/auth/login').send({ email, password }).expect(204);

    const sessionCookie = String(session.headers['set-cookie']);
    expect(sessionCookie).toContain(`${ACCESS_TOKEN_COOKIE}=`);
    expect(sessionCookie).toContain('HttpOnly');
    expect(sessionCookie).toContain('SameSite=Lax');
    expect(session.body).toEqual({});

    const profile = await agent.get('/auth/me').expect(200);

    expect(profile.body.id).toBe(register.body.id);

    await agent.post('/auth/logout').expect(204);
    await agent.get('/auth/me').expect(401);
  });

  it('recusa cookie com token adulterado', async () => {
    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', `${ACCESS_TOKEN_COOKIE}=nao-e-um-jwt`)
      .expect(401);
  });

  it('recusa e-mail ja cadastrado, ignorando caixa', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ name: 'Outro', email: email.toUpperCase(), password })
      .expect(409);
  });

  it('recusa senha errada sem dizer que o e-mail existe', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'senha-errada' })
      .expect(401);

    expect(response.body.message).toBe('E-mail ou senha invalidos.');
  });

  it('bloqueia rota protegida sem cookie de sessao', async () => {
    await request(app.getHttpServer()).get('/auth/me').expect(401);
  });

  it('recusa senha curta na validacao de entrada', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ name: 'Curta', email: `short-${randomUUID()}@lifehub.dev`, password: '123' })
      .expect(400);
  });
});
