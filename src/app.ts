import fastify, { FastifyServerOptions } from 'fastify'
import { isDevelopment } from './utils/development'
import { isValidRoute, isPullRequest } from './utils/hooks'
import { notFound } from './controllers/notFound'
import { pullRequest } from './controllers/pullRequest'

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
    app.addHook('preHandler', (req, res, done) => (isValidRoute(req.url) ? done() : notFound(res)))
    app.addHook('preHandler', (req, res, done) =>
        isPullRequest(req.hostname) ? pullRequest(res) : done()
    )

    /**
     * Base Route. Handles apex route and all subroutes for multi page
     * sites.
     */
    app.get('/', base)

    /**
     * Dev Routes. Only used during development
     */
    if (isDevelopment()) {
        app.get('/templates/*', templatesDev)
    }

    return app
}
