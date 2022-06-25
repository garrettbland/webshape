import { parse, render, getConfig, filters } from 'squirrelly'
import { uniqBy } from 'lodash'
import { TemplateObject } from 'squirrelly/dist/types/parse.js'

/**
 * Example HTML
 */
const EXAMPLE_HTML =
    "<h1>{{ it.title | text }}</h1><p>{{ it.title | text }}</><img width='250px' height='250px' src='{{ it.hero_image | image }}'><p>{{ it.description | content }}</p>"

/**
 * Example DB
 */
const DB_RECORD = {
    name: 'garrett',
    hero_image:
        'https://images.unsplash.com/photo-1656066835561-c850f7384f69?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    title: 'Example site',
}

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

export const build = () => {
    console.log('Building webpage...')

    /**
     * Parse HTML and get data needed for template
     */
    const options = getDynamicItems(EXAMPLE_HTML)
    console.log(`This template needs ${options.map(({ key }) => key).join(', ')}`)
    console.log(`Select stuff from db`)

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
        ...DB_RECORD,
    }

    /**
     * Render html with template data
     */
    const rendered = render(EXAMPLE_HTML, templateData)

    /**
     * Send to client
     */
    console.log(rendered)
    return rendered
}
