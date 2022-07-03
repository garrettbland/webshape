import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify'

/**
 * Validates that incoming request is something that we want to allow to make
 * a database call. Used in Fastifys preHandler hook to check for things like
 * random javascirpt files or other future blacklist type of things such as
 * '/wp-config'
 */
export const validateRoute = (
    req: FastifyRequest,
    res: FastifyReply,
    done: HookHandlerDoneFunction
) => {
    const { url } = req
    if (url.endsWith('.js')) {
        res.type('text/html').status(404).send('404 not found')
    }
    done()
}
