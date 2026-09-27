import { Entity } from '../../../../shared/domain/entity.js';
import { BusinessRuleError } from '../../../../shared/domain/errors/domain.error.js';

export interface UserProps {
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Usuario do life-hub. A entidade e a dona das suas invarantes: e-mail sempre
 * normalizado e valido, nome nao vazio, hash nunca vazio. Ninguem monta um
 * User em estado invalido -- o construtor e privado.
 */
export class User extends Entity<UserProps> {
  private constructor(props: UserProps, id?: string) {
    super(props, id);
  }

  /** Cria um usuario novo (ainda nao persistido). */
  static create(input: { name: string; email: string; passwordHash: string }): User {
    const now = new Date();

    return new User({
      name: User.assertName(input.name),
      email: User.assertEmail(input.email),
      passwordHash: User.assertPasswordHash(input.passwordHash),
      createdAt: now,
      updatedAt: now,
    });
  }

  /** Reconstroi um usuario ja persistido. Usado somente pelos mappers. */
  static restore(props: UserProps, id: string): User {
    return new User(props, id);
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  rename(name: string): void {
    this.props.name = User.assertName(name);
    this.touch();
  }

  changePassword(passwordHash: string): void {
    this.props.passwordHash = User.assertPasswordHash(passwordHash);
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  private static assertName(name: string): string {
    const trimmed = name.trim();

    if (trimmed.length < 2) {
      throw new BusinessRuleError('O nome precisa ter ao menos 2 caracteres.');
    }

    return trimmed;
  }

  private static assertEmail(email: string): string {
    const normalized = email.trim().toLowerCase();

    if (!EMAIL_PATTERN.test(normalized)) {
      throw new BusinessRuleError('E-mail invalido.');
    }

    return normalized;
  }

  private static assertPasswordHash(passwordHash: string): string {
    if (passwordHash.trim().length === 0) {
      throw new BusinessRuleError('Hash de senha vazio.');
    }

    return passwordHash;
  }
}
