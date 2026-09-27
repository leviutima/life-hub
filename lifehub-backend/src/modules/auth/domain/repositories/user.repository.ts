import type { User } from '../entities/user.entity.js';

/**
 * Porta de persistencia de usuario. E uma classe abstrata (nao interface) de
 * proposito: interface TS desaparece no runtime e o Nest precisa de um token
 * concreto para injetar a implementacao.
 */
export abstract class UserRepository {
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create(user: User): Promise<void>;
  abstract save(user: User): Promise<void>;
}
