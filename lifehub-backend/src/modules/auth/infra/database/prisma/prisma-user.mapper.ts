import type { UserModel } from '../../../../../generated/prisma/models.js';
import { User } from '../../../domain/entities/user.entity.js';

/** Traduz entre a linha do Postgres e a entidade de dominio -- nos dois sentidos. */
export class PrismaUserMapper {
  static toDomain(row: UserModel): User {
    return User.restore(
      {
        name: row.name,
        email: row.email,
        passwordHash: row.passwordHash,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      },
      row.id,
    );
  }

  static toPersistence(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
