import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  BusinessRuleError,
  DomainError,
  NotAllowedError,
  ResourceConflictError,
  ResourceNotFoundError,
  UnauthenticatedError,
} from '../../domain/errors/domain.error.js';

/**
 * Unica fronteira onde erro de dominio se transforma em status HTTP.
 * Os use cases continuam lancando DomainError sem importar nada de HTTP.
 */
@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter<DomainError> {
  catch(error: DomainError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const statusCode = this.statusFor(error);

    response.status(statusCode).json({
      statusCode,
      code: error.code,
      message: error.message,
    });
  }

  private statusFor(error: DomainError): HttpStatus {
    if (error instanceof ResourceNotFoundError) return HttpStatus.NOT_FOUND;
    if (error instanceof ResourceConflictError) return HttpStatus.CONFLICT;
    if (error instanceof UnauthenticatedError) return HttpStatus.UNAUTHORIZED;
    if (error instanceof NotAllowedError) return HttpStatus.FORBIDDEN;
    if (error instanceof BusinessRuleError) return HttpStatus.UNPROCESSABLE_ENTITY;

    return HttpStatus.BAD_REQUEST;
  }
}
