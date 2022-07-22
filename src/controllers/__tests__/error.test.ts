import { getApp } from '../../app'
import * as dbApi from '../../db'

describe('Error Controller', () => {
    it('Should return default 500 error', async () => {
        const app = getApp()
        jest.spyOn(dbApi, 'getSiteRouteData').mockResolvedValueOnce([{}])
        const spy = jest.spyOn(console, 'log')

        const response = await app.inject({
            method: 'GET',
            url: '/',
        })

        expect(spy).toHaveBeenCalled()
        expect(response.statusCode).toEqual(500)
        expect(response.headers['content-type']).toEqual('text/html; charset=utf-8')
    })
})
