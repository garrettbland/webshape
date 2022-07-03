import { FastifyReply, FastifyRequest } from 'fastify'
import { build } from '../template'

/**
 * Base route. Handles the majority of logic for WebShape sites
 */
export const base = async (req: FastifyRequest, res: FastifyReply) => {
    const { hostname, url } = req
    const content = await build(hostname, url)
    res.type('text/html').send(content)
}
