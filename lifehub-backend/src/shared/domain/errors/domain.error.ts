/**
 * Erro de regra de negocio, lancado pelo dominio ou pelos use cases.
 *
 * O dominio nao sabe o que e um status HTTP: quem traduz DomainError em
 * resposta HTTP e o DomainExceptionFilter, na camada de infra.
 */
export abstract class DomainError extends Error {
  abstract readonly code: string;

  protected constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

/** O recurso pedido nao existe (ou nao pertence a quem pediu). */
export class ResourceNotFoundError extends DomainError {
  readonly code = 'RESOURCE_NOT_FOUND';

  constructor(resource: string) {
    super(`${resource} nao encontrado.`);
  }
}

/** Ja existe um recurso ocupando essa identidade unica. */
export class ResourceConflictError extends DomainError {
  readonly code = 'RESOURCE_CONFLICT';

  constructor(message: string) {
    super(message);
  }
}

/** Uma invariante do dominio foi violada. */
export class BusinessRuleError extends DomainError {
  readonly code = 'BUSINESS_RULE_VIOLATION';

  constructor(message: string) {
    super(message);
  }
}

/** O usuario existe mas nao pode agir sobre esse recurso. */
export class NotAllowedError extends DomainError {
  readonly code = 'NOT_ALLOWED';

  constructor(message = 'Voce nao tem permissao para essa operacao.') {
    super(message);
  }
}

/** Credencial ausente ou invalida -- o cliente nao provou quem e. */
export class UnauthenticatedError extends DomainError {
  readonly code = 'UNAUTHENTICATED';

  constructor(message = 'Credenciais invalidas.') {
    super(message);
  }
}
