import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../../../generated/prisma/client.js';
import { NodeEnv } from '../../config/env.schema.js';
import { EnvService } from '../../config/env.service.js';

/**
 * Prisma 7 exige um driver adapter -- a connection string vai para o PrismaPg,
 * nao mais para o schema. O ciclo de vida do client segue o do modulo Nest.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(env: EnvService) {
    super({
      adapter: new PrismaPg({ connectionString: env.get('DATABASE_URL') }),
      log: env.get('NODE_ENV') === NodeEnv.development ? ['warn', 'error'] : ['error'],
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log('Conectado ao Postgres.');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
