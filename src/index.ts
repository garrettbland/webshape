import 'dotenv/config'
import { getApp } from './app'
import { isDevelopment, getPort } from './utils/development'

/**
 * Setup app with logging and some extra config options set
 */
const server = getApp({
    logger: {
        transport: isDevelopment()
            ? {
                  target: 'pino-pretty',
                  options: {
                      translateTime: 'HH:MM:ss Z',
                      ignore: 'pid,hostname,time',
                  },
              }
            : undefined,
    },
})

/**
 * Initialize Fastify server
 */
const start = async () => {
    try {
        await server.listen({ port: getPort() })
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}

start()
