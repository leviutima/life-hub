import { Injectable } from '@nestjs/common';
import { EmailAlreadyTakenError } from '../../domain/errors/email-already-taken.error.js';
import { User } from '../../domain/entities/user.entity.js';
import { Password } from '../../domain/value-objects/password.js';
import { Hasher } from '../../domain/services/hasher.js';
import { UserRepository } from '../../domain/repositories/user.repository.js';

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export interface RegisterUserOutput {
  user: User;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: Hasher,
  ) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const password = Password.create(input.password);
    const email = input.email.trim().toLowerCase();

    const alreadyRegistered = await this.users.findByEmail(email);

    if (alreadyRegistered) {
      throw new EmailAlreadyTakenError(email);
    }

    const user = User.create({
      name: input.name,
      email,
      passwordHash: await this.hasher.hash(password.value),
    });

    await this.users.create(user);

    return { user };
  }
}
