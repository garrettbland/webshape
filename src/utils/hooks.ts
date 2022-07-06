import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify'
import { pullRequest } from '../controllers/pullRequest'

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

/**
 * Checks domain to see if it includes Renders automatically
 * generated https://webshape-pr-{PR_#}.onrender.com deploy
 * preview. If true, then return pullRequest controller. If
 * false, continue business as usual.
 */
export const checkPullRequestDomain = (
    req: FastifyRequest,
    res: FastifyReply,
    done: HookHandlerDoneFunction
) => {
    if (req.hostname.includes('webshape-pr-')) {
        pullRequest(res)
        return
    }
    done()
}
