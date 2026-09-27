import { z } from 'zod'

/** Mesmos limites do RegisterUserDto / Password do backend. */
const PASSWORD_MIN = 8
const PASSWORD_MAX = 75

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Informe pelo menos 2 caracteres.')
      .max(120, 'Use no máximo 120 caracteres.'),
    email: z.email('Informe um e-mail válido.'),
    password: z
      .string()
      .min(PASSWORD_MIN, `A senha precisa ter no mínimo ${PASSWORD_MIN} caracteres.`)
      .max(PASSWORD_MAX, `A senha pode ter no máximo ${PASSWORD_MAX} caracteres.`),
    // So existe no front: o backend nunca recebe este campo
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não conferem.',
  })

export type RegisterFormValues = z.infer<typeof registerSchema>

export const PASSWORD_HINT = `Mínimo de ${PASSWORD_MIN} caracteres.`
