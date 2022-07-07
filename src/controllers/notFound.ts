import { FastifyReply } from 'fastify'

/**
 * 404 Not Found Controller
 */
export const notFound = (res: FastifyReply) => {
    res.type('text/html').status(404).send('<h1>404 not found</h1>')
}
