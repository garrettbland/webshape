import { FastifyReply, FastifyRequest } from 'fastify'
import { getSiteRouteData } from '../db'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { buildTemplate } from '../utils/template'

/**
 * Base route. Handles the majority of logic for WebShape sites
 */
export const baseController = async (req: FastifyRequest, res: FastifyReply) => {
    /**
     * req.hostname => localhost:3000, sub.example.com, webshape.dev
     * req.url => /, /about, /staticFile.js, /subpath/someImage.jpg
     */
    const { hostname, url } = req

    const site_route_data = await getSiteRouteData(hostname, url)

    if (!site_route_data?.length) {
        throw Error('No data found for this hostname and url')
    }

    /**
     * Get templates slug from database call.
     * The slug should be the same for all, so just grabbing first one
     */
    const template_slug = site_route_data[0]?.template_id.slug

    /**
     * Read template and get string value from HTML file.
     * In the future, 'index.html' will need to be replaced with url variable, to support
     * multiple pages.
     */
    const template_file_path = join(process.cwd(), 'templates', template_slug, 'index.html')
    const html_template = await readFile(template_file_path, 'utf-8')

    /**
     * Normalize data and just send key/value object
     */
    const template_data = site_route_data.map((item) => {
        return {
            key: item.key,
            value: item.value,
        }
    })

    const content = buildTemplate(html_template, template_data)
    res.type('text/html').send(content)
}
