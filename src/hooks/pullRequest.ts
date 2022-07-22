import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify'
import { pullRequest } from '../controllers/pullRequest'
import { isPullRequest } from '../utils/hooks'

export const checkPullRequest = (
    req: FastifyRequest,
    res: FastifyReply,
    done: HookHandlerDoneFunction
) => {
    if (isPullRequest(req.hostname)) {
        pullRequest(res)
    }
    return done()
}
