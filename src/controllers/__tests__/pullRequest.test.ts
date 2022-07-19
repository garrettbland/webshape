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

    it('Validates that expected data type is sent for arrays', async () => {
        const app = getApp()

        const exampleJsonFile = `{
            "title": "Kitchen Sink",
            "public": false,
            "test_data": {
                "features": [
                    {
                        "title": "Customizable",
                        "description": "Webshape is customizable and stuff",
                        "image": "https://via.placeholder.com/150",
                        "imageAlt": "wee"
                    },
                    {
                        "title": "Simple",
                        "description": "Everything is super simple and quick",
                        "image": "https://via.placeholder.com/150",
                        "imageAlt": "wee"
                    }
                ]
            }
        }`.replace(/\s+/g, ' ')

        /**
         * Spying only once here, because I don't really care about returned
         * HTML template. In this example, the returned HTML string is the same
         * as the mocked meta JSON file above. Not useful, but not this tests
         * concern.
         */
        jest.spyOn(fsModule.promises, 'readFile').mockResolvedValue(exampleJsonFile)

        const response = await app.inject({
            method: 'GET',
            url: '/',
            authority: 'https://webshape-pr-4.onrender.com',
        })

        expect(response.body).toContain('dynamicItemsDiv')
        expect(response.statusCode).toEqual(200)
        expect(response.headers['content-type']).toEqual('text/html; charset=utf-8')
    })
})
