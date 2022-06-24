import fastify, { FastifyServerOptions } from 'fastify'

export const getApp = (opts?: FastifyServerOptions) => {
    const app = fastify(opts)

    app.route({
        method: 'GET',
        url: '/',
        handler: async (request, reply) => {
            reply.type('text/html; charset=utf-8').send('<h1>Site</h1><p>Welcome</p>')
        },
    })

    return app
}
