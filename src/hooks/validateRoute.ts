import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify'
import { notFound } from '../controllers/notFound'
import { isValidRoute } from '../utils/hooks'

export const validateRoute = (
    req: FastifyRequest,
    res: FastifyReply,
    done: HookHandlerDoneFunction
) => {
    if (isValidRoute(req.url)) {
        return done()
    }
    notFound(res)
}
