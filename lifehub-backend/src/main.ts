import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { configureApp } from './app.setup.js';
import { ACCESS_TOKEN_COOKIE } from './modules/auth/presentation/cookies/access-token.cookie.js';
import { EnvService } from './shared/infra/config/env.service.js';

async function bootstrap(): Promise<void> {
  const app = configureApp(await NestFactory.create(AppModule));
  const env = app.get(EnvService);

  // credentials: true deixa o navegador enviar o cookie; por isso a origem e fixa
  app.enableCors({ origin: env.get('WEB_ORIGIN'), credentials: true });

  const swagger = new DocumentBuilder()
    .setTitle('life-hub API')
    .setDescription('API do life-hub')
    .setVersion('0.1.0')
    .addCookieAuth(ACCESS_TOKEN_COOKIE)
    .build();

  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swagger));

  await app.listen(env.get('PORT'));
}

await bootstrap();
