import { parse, render, getConfig, filters } from 'squirrelly'
import { uniqBy } from 'lodash'
import { TemplateObject } from 'squirrelly/dist/types/parse.js'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dztmlsuztaonzwvowtlz.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY as string
const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Example HTML
 */
// const EXAMPLE_HTML =
//     "<h1>{{ it.title | text }}</h1><p>{{ it.title | text }}</><div><img width='250px' height='250px' src='{{ it.hero_image | image }}'></div><p>{{ it.my_name | text }}</p><p>{{ it.description | content }}</p>"

/**
 * Merge custom config options into Squirelly default config
 */
const CONFIG = getConfig({
    tags: ['{{', '}}'],
})

/**
 * Custom filters. Used for our purpose as "tags" to define type of
 * content in template - text, image, content, etc. Reason being that
 * the filters are shown in Ast object from parsing
 */
const FILTERS = ['text', 'content', 'image']
FILTERS.forEach((filterItem) => filters.define(filterItem, (originalVal) => originalVal))

/**
 * Parses HTML template, grabs Ast objects, removes duplicates, and
 * then returns array of normalized readable objects
 */
const getDynamicItems = (HTML: string) => {
    /**
     * Parse HTML string into AST Tree
     */
    const parsedHTML = parse(HTML, CONFIG)

    /**
     * Filter out everything except for AST Objects. These objects
     */
    const allTreeObjects = parsedHTML.filter((i) => i === Object(i))

    /**
     * Remove duplicates. Example - Page title might be used in multiple
     * places.
     */
    const treeObjects = uniqBy(allTreeObjects, 'c')

    /**
     * Normalize data into something we can use and better understand
     * in the rest of our application. Example shape returned by default.
     * Returns array of objects and slices of "it." from "c" value
     * ```
     * { f: [ [Array] ], c: 'it.title', t: 'i'}
     * ```
     */
    const normalizedTreeItems = (treeObjects as TemplateObject[]).map((item) => {
        return {
            key: item?.c?.slice(3),
        }
    })

    return normalizedTreeItems
}

export const build = async () => {
    // Simulate stuff we will get from request
    const DOMAIN = 'webshape.onrender.com'
    const PAGE = '/'

    // First get the domain from the sites table to know which template we need

    let { data: sites, error: sites_error } = await supabase
        .from('sites')
        .select('domain, template_id')
        .eq('domain', DOMAIN)

    const TEMPLATE_ID = (sites as any[])[0].template_id

    // Once we get the template id, get template
    let { data: templates, error: templates_error } = await supabase
        .from('templates')
        .select('id, template')
        .eq('id', TEMPLATE_ID)

    const TEMPLATE = (templates as any[])[0].template

    let { data: test_template_data, error } = await supabase
        .from('test_template_data')
        .select('*')
        .eq('domain', DOMAIN)
        .eq('page', PAGE)

    // takes in array of objects from supabase and reduces into object for template
    const databaseObject = test_template_data?.reduce((previousValue, nextValue) => {
        return {
            ...previousValue,
            [nextValue.key]: nextValue.value,
        }
    }, {})

    /**
     * Parse HTML and get data needed for template
     */
    const options = getDynamicItems(TEMPLATE)
    console.log(`This template needs ${options.map(({ key }) => key).join(', ')}`)

    /**
     * Create object to be injected into template
     */
    const requiredTemplateObject = options.reduce((previousValue, nextValue) => {
        return {
            ...previousValue,
            [nextValue.key as string]: 'Default...',
        }
    }, {})

    /**
     * Merge required object and default values with values from database
     */
    const templateData = {
        ...requiredTemplateObject,
        ...databaseObject,
    }

    /**
     * Render html with template data
     */
    const rendered = render(TEMPLATE, templateData)

    /**
     * Send to client
     */
    return rendered
}
