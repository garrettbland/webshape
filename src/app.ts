import { fastify, FastifyServerOptions } from 'fastify'
import { isDevelopment } from './utils/development'
// import { isValidRoute, isPullRequest } from './utils/hooks'
import { notFound } from './controllers/notFound'
// import { pullRequest } from './controllers/pullRequest'
import { registerFilters } from './utils/filter'
import { MetaFilters, Filters } from './types'
import { validateRoute } from './hooks/validateRoute'
import { checkPullRequest } from './hooks/pullRequest'

/**
 * Controllers
 */
import { baseController } from './controllers/base'
import { devTemplatesController } from './controllers/templates'
import { errorController } from './controllers/error'

export const getApp = (opts?: FastifyServerOptions) => {
    /**
     * Initialize fastify app with options
     */
    const app = fastify(opts)

    /**
     * Register Filters. Registering both MetaFilters and content Filters. The MetaFilters
     * are only useful in the CMS, but we still need to register them while rendering HTML
     * because the filters live in the HTML. So we basically just add them here so Squirelly
     * doesn't error out and yell at us.
     */
    registerFilters([...Object.keys(MetaFilters), ...Object.keys(Filters)])

    /**
     * Sets default not found handler
     */
    app.setNotFoundHandler((req, res) => notFound(res))

    /**
     * Sets default error handler
     */
    app.setErrorHandler((error, req, res) => errorController(error, req, res))

    /**
     * Add hooks to Fastify
     */
    app.addHook('preHandler', validateRoute)
    app.addHook('preHandler', checkPullRequest)

    /**
     * Base Route. Handles apex route and all subroutes for multi page
     * sites.
     */
    app.get('/', baseController)

    /**
     * Dev Routes. Only used during development
     */
    if (isDevelopment()) {
        app.get('/templates/*', devTemplatesController)
    }

    return app
}
