import { FastifyError, FastifyRequest, FastifyReply } from 'fastify'

/**
 * Error Controller
 */
export const errorController = (error: FastifyError, req: FastifyRequest, res: FastifyReply) => {
    console.log(error.message)
    res.type('text/html; charset=utf-8')
        .status(error.statusCode ?? 500)
        .send('<h1>500 Something went wrong</h1>')
}
