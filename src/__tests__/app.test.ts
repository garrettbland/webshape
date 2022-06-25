// import { getApp } from '../app'
// import supertest from 'supertest'

// describe('Application test', () => {
//     const app = getApp()

//     beforeAll(async () => await app.ready())
//     afterAll(() => app.close())

//     it('GET `/test` route', async () => {
//         const response = await supertest(app.server)
//             .get('/test')
//             .expect(200)
//             .expect('Content-Type', 'text/html; charset=utf-8')

//         expect(response.text).toEqual('<h1>Test</h1><p>Working page</p>')
//     })
// })

/**
 * Example test
 */

describe('App', () => {
    it('Should return 1', () => {
        expect(1).toBe(1)
    })
})
