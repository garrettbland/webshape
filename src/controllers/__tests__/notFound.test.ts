import { getApp } from '../../app'

describe('Not Found Controller', () => {
    it('Should return a 404 response', async () => {
        const app = getApp()

        const response = await app.inject({
            method: 'GET',
            url: '/somerandom/path',
        })

        expect(response.statusCode).toEqual(404)
        expect(response.headers['content-type']).toEqual('text/html; charset=utf-8')
    })
})
