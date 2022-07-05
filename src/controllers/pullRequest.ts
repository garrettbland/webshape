import { FastifyReply, FastifyRequest } from 'fastify'
import { join } from 'path'
import { readFile } from 'fs/promises'
import { render } from 'squirrelly'
import { getDynamicItems } from '../utils/template'

/**
 * Pull Request Route. Allows pull request preview URL's to
 * be tested without actually having to get anything from a database.
 * Currently this just uses the kitchen sink template.
 */
export const pullRequest = async (res: FastifyReply) => {
    const template_file_path = join(process.cwd(), 'templates', 'kitchen-sink', 'index.html')
    const template_test_data = join(process.cwd(), 'templates', 'kitchen-sink', 'meta.json')

    const html_template = await readFile(template_file_path, 'utf-8')
    const { test_data } = JSON.parse(await readFile(template_test_data, 'utf-8'))

    const HTML = render(html_template, test_data)

    const dynamicItems = getDynamicItems(html_template)

    res.type('text/html; charset=utf-8').send(
        (HTML as string).concat(
            `<pre style="background:#101827;color:#FFFFFF;border-radius:6px;padding:4px 4px 4px 4px;"><code>${JSON.stringify(
                dynamicItems,
                null,
                4
            )}</pre></code>`
        )
    )
}
