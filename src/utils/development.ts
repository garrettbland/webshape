/**
 * Development flag
 */
export const isDevelopment = (): boolean => process.env.ENVIRONMENT === 'DEVELOPMENT'

/**
 * Server Port. Defaults to 3000
 */
export const getPort = (): number => (process.env.PORT ? parseInt(process.env.PORT) : 3000)
