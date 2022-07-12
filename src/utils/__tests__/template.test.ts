import { getDynamicItems, getFilter, generateDefaultValue, buildTemplate } from '../template'
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
                expect((error as any).message).toBe(
                    'No content filter was found on template tag in HTML...'
                )
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

    describe('generateDefaultValue', () => {
        it('Should return expected default value for each filter type', () => {
            expect(generateDefaultValue('text')).toBe('Default...')
            expect(generateDefaultValue('content')).toBe('Default...')
            expect(generateDefaultValue('image')).toBe('#')
            expect(generateDefaultValue('list')).toBe('[]')
        })
        it('Should throw expected Error if content filter was not found', () => {
            expect(() => generateDefaultValue('something' as any)).toThrowError(
                'Unsupported filter type (something)...'
            )
        })
    })

    describe('buildTemplate', () => {
        beforeAll(() => {
            registerFilters([...Object.keys(MetaFilters), ...Object.keys(Filters)])
        })

        describe('General', () => {
            it('Should render HTML with empty data object', () => {
                const rawHtml = '<p>This site has no dynamic data</p>'
                const data = [{}]
                const rendered = buildTemplate(rawHtml, data)
                expect(rendered).toBe('<p>This site has no dynamic data</p>')
            })
            it('Should return rendered HTML template with multiple same keys', () => {
                const rawHtml = '<p>a: {{ it.title | text }}, b: {{ it.title | content }}</p>'
                const data = [{ key: 'title', value: 'Webshape' }]
                const rendered = buildTemplate(rawHtml, data)
                expect(rendered).toBe('<p>a: Webshape, b: Webshape</p>')
            })
        })

        describe('Filter - "text"', () => {
            it('Should render with "text" filter', () => {
                const rawHtml = '<p>Text: {{ it.title | text }}</p>'
                const data = [{ key: 'title', value: 'Text Filter' }]
                const rendered = buildTemplate(rawHtml, data)
                expect(rendered).toBe('<p>Text: Text Filter</p>')
            })
            it('Should render default value with "text" filter', () => {
                const rawHtml = '<p>Text: {{ it.title | text }}</p>'
                const data = [{}]
                const rendered = buildTemplate(rawHtml, data)
                expect(rendered).toBe('<p>Text: Default...</p>')
            })
        })
        describe('Filter - "content"', () => {
            it('Should render with "content" filter', () => {
                const rawHtml = '<p>Content: {{ it.title | content }}</p>'
                const data = [{ key: 'title', value: 'Content Filter' }]
                const rendered = buildTemplate(rawHtml, data)
                expect(rendered).toBe('<p>Content: Content Filter</p>')
            })
            it('Should render default value with "content" filter', () => {
                const rawHtml = '<p>Content: {{ it.title | content }}</p>'
                const data = [{}]
                const rendered = buildTemplate(rawHtml, data)
                expect(rendered).toBe('<p>Content: Default...</p>')
            })
        })
        describe('Filter - "image"', () => {
            it('Should render with "image" filter', () => {
                const rawHtml =
                    '<img src="{{ it.image_url | image }}" alt="{{ it.image_alt | text }}"/>'
                const data = [
                    { key: 'image_url', value: 'https://example.com/image.jpg' },
                    { key: 'image_alt', value: 'Example Image' },
                ]
                const rendered = buildTemplate(rawHtml, data)
                expect(rendered).toBe(
                    '<img src="https://example.com/image.jpg" alt="Example Image"/>'
                )
            })
            it('Should render default value with "image" filter', () => {
                const rawHtml =
                    '<img src="{{ it.image_url | image }}" alt="{{ it.image_alt | text }}"/>'
                const data = [{ key: 'image_alt', value: 'Example Image' }]
                const rendered = buildTemplate(rawHtml, data)
                expect(rendered).toBe('<img src="#" alt="Example Image"/>')
            })
        })
        describe('Filter - "list"', () => {
            it('Should render with "list" filter', () => {
                const rawHtml =
                    '<ul>{{ @each(it.features) => item | list }}<li>{{ item.title }}</li>{{ /each }}</ul>'
                const data = [
                    { key: 'features', value: '[{ "title": "Easy" }, { "title": "Simple" }]' },
                ]
                const rendered = buildTemplate(rawHtml, data)
                expect(rendered).toBe('<ul><li>Easy</li><li>Simple</li></ul>')
            })
            it('Should render default value with "list" filter', () => {
                const rawHtml =
                    '<ul>{{ @each(it.features) => item | list }}<li>{{ item.title }}</li>{{ /each }}</ul>'
                const data = [{}]
                const rendered = buildTemplate(rawHtml, data)
                expect(rendered).toBe('<ul></ul>')
            })
        })
    })
})
