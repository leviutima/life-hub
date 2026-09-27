import { UnauthenticatedError } from '../../../../shared/domain/errors/domain.error.js';

/** Mensagem deliberadamente vaga: nao revela se o e-mail existe na base. */
export class InvalidCredentialsError extends UnauthenticatedError {
  constructor() {
    super('E-mail ou senha invalidos.');
  }
}
