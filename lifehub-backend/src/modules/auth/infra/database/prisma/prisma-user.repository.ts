import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../shared/infra/database/prisma/prisma.service.js';
import type { User } from '../../../domain/entities/user.entity.js';
import { UserRepository } from '../../../domain/repositories/user.repository.js';
import { PrismaUserMapper } from './prisma-user.mapper.js';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { id } });

    return row ? PrismaUserMapper.toDomain(row) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { email } });

    return row ? PrismaUserMapper.toDomain(row) : null;
  }

  async create(user: User): Promise<void> {
    await this.prisma.user.create({ data: PrismaUserMapper.toPersistence(user) });
  }

  async save(user: User): Promise<void> {
    const data = PrismaUserMapper.toPersistence(user);

    await this.prisma.user.update({ where: { id: user.id }, data });
  }
}
