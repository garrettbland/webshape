import fastify, { FastifyServerOptions } from 'fastify'
import { build, getDynamicItems, supabase } from './template'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { render } from 'squirrelly'

const isDevelopment = process.env.ENVIRONMENT === 'DEVELOPMENT'

export const getApp = (opts?: FastifyServerOptions) => {
    const app = fastify(opts)

    /**
     * Add in middleware that lets us know if its our "webshape.dev"
     * site to send user to the react app or whatever.
     */

    // app.route({
    //     method: 'GET',
    //     url: '/test',
    //     handler: async (request, reply) => {
    //         reply.type('text/html; charset=utf-8').send('<h1>Site</h1><p>Welcome</p>')
    //     },
    // })

    const getPathName = (PROTOCOL: string, HOSTNAME: string, ROUTE: string): string => {
        return new URL(`${PROTOCOL}://${HOSTNAME}${ROUTE}`)?.pathname
    }

    app.get('/', async (request, reply) => {
        // Need to make sure is GET request
        const HOSTNAME = request.hostname
        const PROTOCOL = request.protocol
        const ROUTE = request.url

        console.log({ HOSTNAME, PROTOCOL, ROUTE })

        const content = await build(HOSTNAME, ROUTE)
        reply.type('text/html').send(content)
    })

    app.get('/admin', async (request, reply) => {
        // render out admin CMS page

        const HOSTNAME = request.hostname
        const PROTOCOL = request.protocol
        const ROUTE = request.url

        let { data: page_template, error: sites_error } = await supabase
            .from('site_page_template')
            .select('domain, template_id')
            .eq('domain', HOSTNAME)

        const TEMPLATE_ID = (page_template as any[])[0].template_id

        // Once we get the template id, get template
        let { data: templates, error: templates_error } = await supabase
            .from('templates')
            .select('id, template')
            .eq('id', TEMPLATE_ID)

        const TEMPLATE = (templates as any[])[0].template

        const dynamic_items = getDynamicItems(TEMPLATE)
        const admin_html =
            '<h1>Admin Page</h1><p><pre><code>' +
            JSON.stringify(dynamic_items) +
            '</code></pre></p>'

        reply.type('text/html; charset=utf-8').send(admin_html)
    })

    app.get('/test/*', async (request, reply) => {
        const HOSTNAME = request.hostname
        const PROTOCOL = request.protocol
        const ROUTE = request.url

        const STATS =
            '<pre><code><p>Hostname: ' +
            HOSTNAME +
            '</p><p>Route: ' +
            getPathName(PROTOCOL, HOSTNAME, ROUTE) +
            '</p></pre></code>'

        reply.type('text/html; charset=utf-8').send(STATS)
    })

    // Dev only for template development
    if (isDevelopment) {
        app.get('/templates/*', async (request, reply) => {
            const HOSTNAME = request.hostname
            const PROTOCOL = request.protocol
            const ROUTE = request.url

            const path = getPathName(PROTOCOL, HOSTNAME, ROUTE)

            const template_file_path = join(process.cwd(), path, 'index.html')
            const template_test_data = join(process.cwd(), path, 'meta.json')

            const html_template = await readFile(template_file_path, 'utf-8')
            const { test_data } = JSON.parse(await readFile(template_test_data, 'utf-8'))

            const HTML = render(html_template, test_data)

            reply.type('text/html; charset=utf-8').send(HTML)
        })
    }

    return app
}
