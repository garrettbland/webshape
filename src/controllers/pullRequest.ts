import { FastifyReply } from 'fastify'
import { join } from 'path'
import { readFile } from 'fs/promises'
import { getDynamicItems, buildTemplate } from '../utils/template'

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

    /**
     * Typeof thing for value is for arrays. Arrays are stored as JSON.stringified
     * strings in database. In meta.json, it's not stringified the same way so we
     * do it at runtime so we don't have to mess with pure strings while developing.
     */
    const template_data = Object.entries(test_data).map(([key, value]) => {
        return {
            key: key,
            value: typeof value !== 'string' ? JSON.stringify(value) : (value as string),
        }
    })

    const HTML = buildTemplate(html_template, template_data)

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
