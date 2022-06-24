import { getApp } from '../app'
import supertest from 'supertest'

describe('Application test', () => {
    const app = getApp()

    beforeAll(async () => await app.ready())
    afterAll(() => app.close())

    it('GET `/` route', async () => {
        const response = await supertest(app.server)
            .get('/')
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')

        expect(response.text).toEqual('<h1>Site</h1><p>Welcome</p>')
    })
})
