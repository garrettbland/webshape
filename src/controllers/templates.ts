import { FastifyReply, FastifyRequest } from 'fastify'
import { join } from 'path'
import { readFile } from 'fs/promises'
import { buildTemplate } from '../utils/template'

/**
 * Templates Route. Allows templates to be developed using
 * the same path. Example -> localhost:3000/templates/basic will
 * render [rootpath]/templates/webshape/index.html. This will also
 * use its corrosponding `meta.json` file for the test data.
 */
export const devTemplatesController = async (req: FastifyRequest, res: FastifyReply) => {
    const { url } = req

    const path = url

    const template_file_path = join(process.cwd(), path, 'index.html')
    const template_test_data = join(process.cwd(), path, 'meta.json')

    const html_template = await readFile(template_file_path, 'utf-8')
    const { test_data } = JSON.parse(await readFile(template_test_data, 'utf-8'))

    /**
     * Doing this weird typeof nonsense for template dev testing only. Arrays are stored
     * in database as a string (JSON stringified), but I don't want to mess with stringified arrays
     * while developing
     */
    const template_data = Object.entries(test_data).map(([key, value]) => {
        return {
            key: key,
            value: typeof value !== 'string' ? JSON.stringify(value) : (value as string),
        }
    })

    const HTML = buildTemplate(html_template, template_data)

    res.type('text/html; charset=utf-8').send(HTML)
}
