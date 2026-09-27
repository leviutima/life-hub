import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
  Max,
  Min,
  MinLength,
  validateSync,
} from 'class-validator';

export enum NodeEnv {
  development = 'development',
  test = 'test',
  production = 'production',
}

/**
 * Contrato das variaveis de ambiente. Se algo estiver faltando ou torto, a app
 * nao sobe -- falhar no boot e melhor que descobrir em runtime.
 */
export class EnvSchema {
  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv = NodeEnv.development;

  @IsInt()
  @Min(1)
  @Max(65535)
  PORT: number = 3000;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsString()
  @MinLength(32, { message: 'JWT_SECRET precisa ter no minimo 32 caracteres.' })
  JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_EXPIRES_IN: string = '7d';

  /** Origem do front. Com cookie de sessao o CORS nao pode refletir qualquer origem. */
  @IsUrl({ require_tld: false })
  WEB_ORIGIN: string = 'http://localhost:5173';
}

export function validateEnv(raw: Record<string, unknown>): EnvSchema {
  const env = plainToInstance(EnvSchema, raw, { enableImplicitConversion: true });
  const errors = validateSync(env, { skipMissingProperties: false });

  if (errors.length > 0) {
    const details = errors
      .map((error) => `  - ${error.property}: ${Object.values(error.constraints ?? {}).join('; ')}`)
      .join('\n');

    throw new Error(`Variaveis de ambiente invalidas:\n${details}`);
  }

  return env;
}
