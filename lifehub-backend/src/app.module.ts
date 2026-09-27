import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module.js';
import { EnvModule } from './shared/infra/config/env.module.js';

@Module({
  imports: [EnvModule, AuthModule],
})
export class AppModule {}
