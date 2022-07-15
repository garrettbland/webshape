import { getApp } from '../../app'
import * as dbApi from '../../db'

describe('Base Controller', () => {
    it('Should return normal HTML content', async () => {
        const app = getApp()

        jest.spyOn(dbApi, 'getSiteRouteData').mockResolvedValueOnce([
            {
                key: 'title',
                value: 'Rays Flowers',
                template_id: { slug: 'kitchen-sink' },
                sites: {
                    hostname: 'webshape.dev',
                },
            },
            {
                key: 'description',
                value: 'Wonderful flower shop in town',
                template_id: { slug: 'kitchen-sink' },
                sites: {
                    hostname: 'webshape.dev',
                },
            },
        ])

        const response = await app.inject({
            method: 'GET',
            url: '/',
        })

        expect(response.statusCode).toEqual(200)
        expect(response.headers['content-type']).toEqual('text/html; charset=utf-8')
    })
    it('Should throw error if no db data found', async () => {
        const app = getApp()

        jest.spyOn(dbApi, 'getSiteRouteData').mockResolvedValueOnce([])

        const response = await app.inject({
            method: 'GET',
            url: '/',
        })

        expect(response.statusCode).toEqual(500)
        expect(response.headers['content-type']).toEqual('text/html; charset=utf-8')
    })
})
