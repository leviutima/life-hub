/** Identidade que o JwtAuthGuard anexa a request apos validar o token. */
export interface AuthenticatedUser {
  id: string;
  email: string;
}
