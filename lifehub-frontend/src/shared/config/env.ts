const apiUrl: string | undefined = import.meta.env.VITE_API_URL

if (!apiUrl) {
  throw new Error('VITE_API_URL nao definida. Copie .env.example para .env.local.')
}

export const env = {
  apiUrl,
} as const
