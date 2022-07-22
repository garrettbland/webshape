import { FastifyReply } from 'fastify'

/**
 * 404 Not Found Controller
 */
export const notFound = (res: FastifyReply) => {
    res.type('text/html; charset=utf-8').status(404).send('<h1>404 not found</h1>')
}
