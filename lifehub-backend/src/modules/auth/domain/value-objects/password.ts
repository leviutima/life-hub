import { BusinessRuleError } from '../../../../shared/domain/errors/domain.error.js';

/**
 * Senha em texto puro, validada. Existe para que a regra "o que e uma senha
 * aceitavel" viva no dominio, e nao espalhada em DTO e use case.
 */
export class Password {
  static readonly MIN_LENGTH = 8;
  static readonly MAX_LENGTH = 75; // limite do bcrypt: alem disso ele trunca

  private constructor(private readonly plain: string) {}

  static create(plain: string): Password {
    if (plain.length < Password.MIN_LENGTH) {
      throw new BusinessRuleError(
        `A senha precisa ter no minimo ${Password.MIN_LENGTH} caracteres.`,
      );
    }

    if (plain.length > Password.MAX_LENGTH) {
      throw new BusinessRuleError(
        `A senha pode ter no maximo ${Password.MAX_LENGTH} caracteres.`,
      );
    }

    return new Password(plain);
  }

  get value(): string {
    return this.plain;
  }

  /** Evita vazar a senha em log, JSON.stringify ou template string. */
  toString(): string {
    return '[Password]';
  }

  toJSON(): string {
    return '[Password]';
  }
}
