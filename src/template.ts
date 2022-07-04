import { render, filters } from 'squirrelly'
import { getDynamicItems } from './utils/template'
import { createClient } from '@supabase/supabase-js'
import { generateFilters } from './utils/filter'
const supabaseUrl = 'https://dztmlsuztaonzwvowtlz.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY as string
export const supabase = createClient(supabaseUrl, supabaseKey)

import { getRouteTemplate } from './db'

/**
 * Register Filters
 */
generateFilters()

export const build = async (HOSTNAME: string, ROUTE: string) => {
    const TEMPLATE = await getRouteTemplate(HOSTNAME, ROUTE)

    if (!TEMPLATE) {
        throw Error('Something went wrong getting template...')
    }

    let { data: test_template_data, error } = await supabase
        .from('test_template_data')
        .select('key, value')
        .eq('domain', HOSTNAME)
        .eq('route', ROUTE)

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
            key: (item.key as string) ?? 'Default...',
            type: item.type,
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
