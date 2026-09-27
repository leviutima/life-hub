import type { User } from '../../domain/entities/user.entity.js';

export interface UserHttpResponse {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

/**
 * Decide o que sai pela API. Existe justamente para que o passwordHash nunca
 * escape por acidente ao serializar a entidade.
 */
export class UserPresenter {
  static toHttp(user: User): UserHttpResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
