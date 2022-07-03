import { FastifyReply, FastifyRequest } from 'fastify'
import { getPathName } from '../utils/path'
import { join } from 'path'
import { readFile } from 'fs/promises'
import { render } from 'squirrelly'

/**
 * Templates Route. Allows templates to be developed using
 * the same path. Example -> localhost:3000/templates/basic will
 * render [rootpath]/templates/webshape/index.html. This will also
 * use its corrosponding `meta.json` file for the test data.
 */
export const templatesDev = async (req: FastifyRequest, res: FastifyReply) => {
    const { hostname, protocol, url } = req

    const path = getPathName(protocol, hostname, url)

    const template_file_path = join(process.cwd(), path, 'index.html')
    const template_test_data = join(process.cwd(), path, 'meta.json')

    const html_template = await readFile(template_file_path, 'utf-8')
    const { test_data } = JSON.parse(await readFile(template_test_data, 'utf-8'))

    const HTML = render(html_template, test_data)

    res.type('text/html; charset=utf-8').send(HTML)
}
