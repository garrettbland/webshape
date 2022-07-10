import { getDynamicItems, getFilter, buildTemplate } from '../template'
import { registerFilters } from '../filter'
import { MetaFilters, Filters } from '../../types'

describe('template', () => {
    describe('getDynamicItems', () => {
        it('Gets dynamic items from HTML string', () => {
            const testHTML = '<p>{{ it.title | text | label("Title") }}'
            const testAST = getDynamicItems(testHTML)
            expect(testAST[0].key).toBe('title')
            expect(testAST[0].type).toBe('text')
        })
        it('Should only return single key/value for duplicates', () => {
            const testHTML = `
                <p>{{ it.title | text }}</p>
                <img src="{{ it.heroImage | image }}" alt="{{ it.title | text}}">
            `
            const testAST = getDynamicItems(testHTML)
            expect(testAST.length).toBe(2)
            expect(testAST[0].key).toBe('title')
            expect(testAST[0].type).toBe('text')
            expect(testAST[1].key).toBe('heroImage')
            expect(testAST[1].type).toBe('image')
        })
        it('Should throw error if content filter is not found', () => {
            try {
                const testHTML = `
                <p>{{ it.title | label('Testing') }}</p>
            `
                getDynamicItems(testHTML)
            } catch (error) {
                expect((error as any).message).toBe('No content Filter case found...')
            }
        })
    })
    describe('getFilter', () => {
        it('Should find first available filter from template tag', () => {
            const filters = [['text', '']] as any
            expect(getFilter(filters)).toBe('text')
        })
        it('Should find first available filter from template tag & label', () => {
            const filters = [
                ['image', ''],
                ['label', 'Background Image'],
            ] as any
            expect(getFilter(filters)).toBe('image')
        })
        it('Should return null if no filter is added', () => {
            const filters = [] as any
            expect(getFilter(filters)).toBe(null)
        })
        it('Should return null if no suitable content filter is found', () => {
            const filters = [['animal', '']] as any
            expect(getFilter(filters)).toBe(null)
        })
    })

    describe('buildTemplate', () => {
        it('Should return rendered HTML template', () => {
            const testHTMLTemplate = '<p>Site title: {{ it.title | text }}</p>'
            const testTemplateData = [{ key: 'title', value: 'Webshape' }]
            registerFilters([...Object.keys(MetaFilters), ...Object.keys(Filters)])
            const HTMLString = buildTemplate(testHTMLTemplate, testTemplateData)
            expect(HTMLString).toBe('<p>Site title: Webshape</p>')
        })
        /**
         * TO DO: Add more scenarioes to test images, lists, content, ect (all filters)
         */
    })
})
