import { render } from 'squirrelly'
import { getDynamicItems } from './utils/template'
import { registerFilters } from './utils/filter'
import { MetaFilters, Filters } from './types'

import { getRouteData, getRouteTemplate } from './db'

/**
 * Register Filters. Registering both MetaFilters and content Filters. The MetaFilters
 * are only useful in the CMS, but we still need to register them while rendering HTML
 * because the filters live in the HTML. So we basically just add them here so Squirelly
 * doesn't error out and yell at us.
 */
registerFilters([...Object.keys(MetaFilters), ...Object.keys(Filters)])

export const build = async (HOSTNAME: string, ROUTE: string) => {
    const TEMPLATE = (await getRouteTemplate(HOSTNAME, ROUTE)) ?? ''

    const test_template_data = await getRouteData(HOSTNAME, ROUTE)

    /**
     * Parse HTML and get data needed for template
     */
    const options = getDynamicItems(TEMPLATE)
    console.log(`This template needs ${options.map(({ key }) => key).join(', ')}`)

    /**
     * Create array of objects to be injected into template
     */
    const requiredTemplateObjects = options.map((item) => {
        return {
            key: item.key as string,
            type: item.type,
            value: 'Default...',
        }
    })

    const mergedDatabaseTemplateArrays = requiredTemplateObjects.map((item) => {
        return {
            ...item,
            ...test_template_data?.find((db) => db.key === item.key),
        }
    })

    const templateData = mergedDatabaseTemplateArrays.reduce((previousValue, nextvalue) => {
        if (nextvalue.type === 'list') {
            return {
                ...previousValue,
                [nextvalue.key as string]: JSON.parse(nextvalue.value),
            }
        }

        return {
            ...previousValue,
            [nextvalue.key as string]: nextvalue.value,
        }
    }, {})

    /**
     * Render html with template data
     */
    const rendered = render(TEMPLATE, templateData)

    /**
     * Send to client
     */
    return rendered
}
