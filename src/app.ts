import fastify, { FastifyServerOptions } from 'fastify'
import { isDevelopment } from './utils/development'
import { validateRoute, checkPullRequestDomain } from './utils/hooks'

/**
 * Controllers
 */
import { base } from './controllers/base'
import { templatesDev } from './controllers/templates.dev'

export const getApp = (opts?: FastifyServerOptions) => {
    /**
     * Initialize fastify app with options
     */
    const app = fastify(opts)

    /**
     * Add hooks to Fastify
     */
    app.addHook('preHandler', validateRoute)
    app.addHook('preHandler', checkPullRequestDomain)

    /**
     * Base Route. Handles apex route and all subroutes for multi page
     * sites.
     */
    app.get('/', base)

    /**
     * Dev Routes. Only used during development
     */
    if (isDevelopment) {
        app.get('/templates/*', templatesDev)
    }

    return app
}
