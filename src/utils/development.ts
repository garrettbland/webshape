/**
 * Development flag
 */
export const isDevelopment = process.env.ENVIRONMENT === 'DEVELOPMENT'

/**
 * Server Port. Defaults to 3000
 */
export const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000
