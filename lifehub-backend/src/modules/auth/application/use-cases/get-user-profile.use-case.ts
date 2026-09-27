import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '../../../../shared/domain/errors/domain.error.js';
import type { User } from '../../domain/entities/user.entity.js';
import { UserRepository } from '../../domain/repositories/user.repository.js';

export interface GetUserProfileInput {
  userId: string;
}

export interface GetUserProfileOutput {
  user: User;
}

@Injectable()
export class GetUserProfileUseCase {
  constructor(private readonly users: UserRepository) {}

  async execute(input: GetUserProfileInput): Promise<GetUserProfileOutput> {
    const user = await this.users.findById(input.userId);

    if (!user) {
      throw new ResourceNotFoundError('Usuario');
    }

    return { user };
  }
}
