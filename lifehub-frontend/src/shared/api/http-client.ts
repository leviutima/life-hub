import axios from 'axios'
import { env } from '@/shared/config'

/**
 * withCredentials: o navegador anexa o cookie httpOnly de sessao em toda
 * chamada. O front nunca le nem guarda o token -- nem consegue.
 */
export const httpClient = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
})
