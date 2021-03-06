import { parse, render, defaultConfig } from 'squirrelly'
import { uniqBy } from 'lodash'
import { TemplateObject, Filter } from 'squirrelly/dist/types/parse.js'
import { Filters } from '../types'

interface DynamicValues {
    key: string
    type: keyof typeof Filters
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
     *
     * TODO: Need to address. Each tree object has the "t" key but the value differs
     * for loops and text. Text is 'c'. Loops/each are 'h'. No idea why. When its a loop,
     * Text uses "c" for the dynamic "it.[name]" and loops use "p" for dynamic "it.[name]"
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
    const normalizedTreeItems: DynamicValues[] = (treeObjects as TemplateObject[]).map((item) => {
        const filter = getFilter(item.f)
        switch (filter) {
            case 'text': {
                return {
                    key: item!.c!.slice(3),
                    type: 'text',
                }
            }
            case 'content': {
                return {
                    key: item!.c!.slice(3),
                    type: 'content',
                }
            }
            case 'image': {
                return {
                    key: item!.c!.slice(3),
                    type: 'image',
                }
            }
            case 'list': {
                return {
                    key: item!.p!.slice(3),
                    type: 'list',
                }
            }
            default: {
                throw Error(`No content filter was found on template tag in HTML...`)
            }
        }
    })

    return normalizedTreeItems
}

/**
 * Returns first found filter from filters array generated by Squirelly. Key
 * value generated from Squirelly looks like this originally.
 * { f: [ [Array] ] }
 * Usage...
 * ```
 * // example item.f: [['text', '']]
 * const filter = getFilter(item.f) ==> 'text'
 * ```
 *
 * No filters passed in HTML will result in empty array
 * ```
 * // <!-- HTML -->
 * // <div>{{ it.title }}</div>
 * ```
 * Would return the following...
 * ```
 * {
 *  f: [ ]
 * }
 * ```
 *
 * Mulitple filters can be passed on a data item. A text filter for example...
 * ```
 * // <!-- HTML -->
 * // <div>{{ it.title | text }}</div>
 * ```
 * Would return the following...
 * ```
 * {
 *  f: [ ['text', ''] ]
 * }
 * ```
 * The 0 index of each array is the filter name. The 1 index is any parameters. So the following...
 * ```
 * // <!-- HTML -->
 * // <div>{{ it.title | text | label('Home Page Title') }}</div>
 * ```
 * Would return the following...
 * ```
 * {
 *  f: [ ['text', ''], ['label','Home Page Title'] ]
 * }
 * ```
 */
export const getFilter = (filtersArray: Array<Filter>): string | null => {
    const availableFilters = Object.keys(Filters)

    const filter = filtersArray.find((item) => availableFilters.includes(item[0])) ?? [null]

    return filter[0]
}

/**
 * Returns string default value to be used within template. This is useful to continue
 * rendering the template, even if the dynamic data doesn't exist in the database yet. This
 * is for when users switch theme's, or new dynamic options are added to the template.
 */
export const generateDefaultValue = (itemType: keyof typeof Filters): string => {
    switch (itemType) {
        case 'text': {
            return 'Default...'
        }
        case 'content': {
            return 'Default...'
        }
        case 'image': {
            return '#'
        }
        case 'list': {
            return '[]'
        }
        default: {
            throw Error(`Unsupported filter type (${itemType})...`)
        }
    }
}

export const buildTemplate = (
    htmlTemplate: string,
    routeData: Record<string, string>[]
): string => {
    /**
     * Parse HTML and get data needed for template
     */
    const options = getDynamicItems(htmlTemplate)

    /**
     * Create array of objects to be injected into template with default
     * value and type added.
     * TO DO: Setup
     */
    const requiredTemplateObjects = options.map((item) => {
        return {
            key: item.key as string,
            type: item.type,
            value: generateDefaultValue(item.type),
        }
    })

    const mergedDatabaseTemplateArrays = requiredTemplateObjects.map((item) => {
        return {
            ...item,
            ...routeData?.find((_) => _.key === item.key),
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
    const rendered = render(htmlTemplate, templateData)

    return rendered
}
