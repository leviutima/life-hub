import { type INestApplication, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DomainExceptionFilter } from './shared/presentation/filters/domain-exception.filter.js';

/**
 * Configuracao global da aplicacao, num lugar so: o servidor de verdade e os
 * testes e2e sobem com exatamente o mesmo comportamento de pipe e filtro.
 */
export function configureApp<T extends INestApplication>(app: T): T {
  // A sessao trafega em cookie httpOnly; o guard le de request.cookies
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // descarta campos nao declarados no DTO
      forbidNonWhitelisted: true, // e reclama se vierem
      transform: true,
    }),
  );

  app.useGlobalFilters(new DomainExceptionFilter());

  return app;
}
