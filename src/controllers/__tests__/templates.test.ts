import { getApp } from '../../app'

describe('Template Controller', () => {
    const CURRENT_ENV = process.env

    beforeEach(() => {
        jest.resetModules()
        process.env.ENVIRONMENT = 'DEVELOPMENT'
    })

    afterAll(() => {
        /**
         * Restore environment
         */
        process.env = CURRENT_ENV
    })

    it('Should return normal response for templates', async () => {
        const app = getApp()

        const basicTemplateResponse = await app.inject({
            method: 'GET',
            url: '/templates/basic',
        })

        const webshapeTemplateResponse = await app.inject({
            method: 'GET',
            url: '/templates/webshape',
        })

        expect(basicTemplateResponse.statusCode).toEqual(200)
        expect(basicTemplateResponse.headers['content-type']).toEqual('text/html; charset=utf-8')

        expect(webshapeTemplateResponse.statusCode).toEqual(200)
        expect(webshapeTemplateResponse.headers['content-type']).toEqual('text/html; charset=utf-8')
    })
    it('Should return error if no template found for request', async () => {
        const app = getApp()

        const response = await app.inject({
            method: 'GET',
            url: '/templates/no-template-here',
        })

        expect(response.statusCode).toEqual(500)
        expect(response.headers['content-type']).toEqual('text/html; charset=utf-8')
    })
})
