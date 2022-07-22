import { filters } from 'squirrelly'

/**
 * Registers Squirelly custom filters. Used for our purpose as "tags" to define type of
 * content in template - text, image, content, etc.
 */
export const registerFilters = (FILTERS: string[]): void => {
    FILTERS.forEach((filterItem) => filters.define(filterItem, (originalVal) => originalVal))
}
