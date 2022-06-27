import fastify, { FastifyServerOptions } from 'fastify'
import { build } from './template'

export const getApp = (opts?: FastifyServerOptions) => {
    const app = fastify(opts)

    // app.route({
    //     method: 'GET',
    //     url: '/test',
    //     handler: async (request, reply) => {
    //         reply.type('text/html; charset=utf-8').send('<h1>Site</h1><p>Welcome</p>')
    //     },
    // })

    app.get('/', async (request, reply) => {
        // Need to make sure is GET request
        const HOSTNAME = request.hostname
        const PROTOCOL = request.protocol
        const ROUTE = request.url
        const content = await build(HOSTNAME, ROUTE)
        reply.type('text/html').send(content)
    })

    app.get('/test/*', async (request, reply) => {
        const HOSTNAME = request.hostname
        const PROTOCOL = request.protocol
        const ROUTE = request.url

        const getPathName = (): string => {
            return new URL(`${PROTOCOL}://${HOSTNAME}${ROUTE}`)?.pathname
        }

        const STATS =
            '<pre><code><p>Hostname: ' +
            HOSTNAME +
            '</p><p>Route: ' +
            getPathName() +
            '</p></pre></code>'

        reply.type('text/html; charset=utf-8').send(STATS)
    })

    return app
}
