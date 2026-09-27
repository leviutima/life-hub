import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { EnvSchema } from './env.schema.js';

/**
 * Acesso tipado ao ambiente. Ninguem no projeto le process.env direto:
 * assim uma chave inexistente e erro de compilacao, nao undefined.
 */
@Injectable()
export class EnvService {
  constructor(private readonly config: ConfigService<EnvSchema, true>) {}

  get<K extends keyof EnvSchema>(key: K): EnvSchema[K] {
    return this.config.get(key, { infer: true });
  }
}
