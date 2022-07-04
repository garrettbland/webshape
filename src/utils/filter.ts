import { Filters } from '../types'
import { filters } from 'squirrelly'

/**
 * Custom filters. Used for our purpose as "tags" to define type of
 * content in template - text, image, content, etc.
 */
export const generateFilters = () => {
    const FILTERS = Object.keys(Filters)
    FILTERS.forEach((filterItem) => filters.define(filterItem, (originalVal) => originalVal))
}
