import { ResourceConflictError } from '../../../../shared/domain/errors/domain.error.js';

export class EmailAlreadyTakenError extends ResourceConflictError {
  constructor(email: string) {
    super(`O e-mail ${email} ja esta em uso.`);
  }
}
