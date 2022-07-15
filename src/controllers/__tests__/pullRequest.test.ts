import { getApp } from '../../app'
import * as fsModule from 'fs'

describe('Pull Request Controller', () => {
    it('Returns PR template if PR build', async () => {
        const app = getApp()

        const readFileSpy = jest.spyOn(fsModule.promises, 'readFile')

        const response = await app.inject({
            method: 'GET',
            url: '/',
            authority: 'https://webshape-pr-4.onrender.com',
        })

        expect(readFileSpy).toHaveBeenCalledTimes(2)
        expect(response.body).toContain('dynamicItemsDiv')
        expect(response.statusCode).toEqual(200)
        expect(response.headers['content-type']).toEqual('text/html; charset=utf-8')
    })
})
