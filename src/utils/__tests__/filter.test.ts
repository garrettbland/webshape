import { registerFilters } from '../filter'
import * as squirrelly from 'squirrelly'
import { Filters } from '../../types'

const FILTERS = Object.keys(Filters)

describe('filter', () => {
    it('Should call Squirellys define filter method', () => {
        const spy = jest.spyOn(squirrelly.filters, 'define')

        registerFilters(FILTERS)

        expect(spy).toBeCalledTimes(FILTERS.length)
    })
})
