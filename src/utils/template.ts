import { parse, defaultConfig } from 'squirrelly'
import { uniqBy } from 'lodash'
import { TemplateObject } from 'squirrelly/dist/types/parse.js'

interface DynamicValues {
    key: string
}

/**
 * Parses HTML templates & returns normalized array of objects
 * containing dynamic items. Used to generate required items
 * to populate database, as well as to produce CMS.
 */
export const getDynamicItems = (HTML: string): DynamicValues[] => {
    /**
     * Parse HTML string into abstract syntax tree
     */
    const parsedHTML = parse(HTML, defaultConfig)

    /**
     * Filter out everything except for the abstract tree syntax
     * objects.
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
            key: item!.c!.slice(3),
        }
    })

    return normalizedTreeItems
}
