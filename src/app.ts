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
        const content = await build()
        reply.type('text/html').send(content)
    })

    app.get('/test', async (request, reply) => {
        reply.type('text/html; charset=utf-8').send('<h1>Test</h1><p>Working page</p>')
    })

    return app
}
