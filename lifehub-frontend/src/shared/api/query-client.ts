import { QueryClient } from '@tanstack/react-query'

/**
 * Instancia unica: o provider do React e os middlewares do router (que rodam
 * fora do React) precisam enxergar o mesmo cache.
 */
export const queryClient = new QueryClient()
