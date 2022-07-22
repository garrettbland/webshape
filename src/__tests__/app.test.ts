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
var notFoundMock = jest.fn()
var errorMock = jest.fn()
var addHookMock = jest.fn()
var getMock = jest.fn()

jest.mock('fastify', () => {
    const original = jest.requireActual('fastify') // Step 2.
    return {
        ...original,
        fastify: jest.fn(() => ({
            setNotFoundHandler: notFoundMock,
            setErrorHandler: errorMock,
            addHook: addHookMock,
            get: getMock,
        })),
    }
})

import { getApp } from '../app'
import * as filtersModule from '../utils/filter'

describe('App', () => {
    const CURRENT_ENV = process.env

    beforeEach(() => {
        process.env.ENVIRONMENT = 'DEVELOPMENT'
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    afterAll(() => {
        process.env = CURRENT_ENV
    })

    it('Should register filters', () => {
        const spy = jest.spyOn(filtersModule, 'registerFilters')
        getApp()
        expect(spy).toBeCalledTimes(1)
    })
    it('Should set error and not found handlers', () => {
        getApp()
        expect(notFoundMock).toBeCalledTimes(1)
        expect(errorMock).toBeCalledTimes(1)
    })
    it('Should add expected hooks', () => {
        getApp()

        expect(addHookMock).toBeCalledTimes(2)

        expect(addHookMock.mock.calls[0][0]).toEqual('preHandler')
        expect(typeof addHookMock.mock.calls[0][1]).toEqual('function')

        expect(addHookMock.mock.calls[1][0]).toEqual('preHandler')
        expect(typeof addHookMock.mock.calls[1][1]).toEqual('function')
    })
    it('Should setup base route controller for "/"', () => {
        process.env.ENVIRONMENT = 'PRODUCTION'

        getApp()

        expect(getMock).toBeCalledTimes(1)
        expect(getMock.mock.calls[0][0]).toEqual('/')
    })
    it('Should setup "/templates/*" route if development', () => {
        process.env.ENVIRONMENT = 'DEVELOPMENT'

        getApp()

        expect(getMock).toBeCalledTimes(2)
        expect(getMock.mock.calls[1][0]).toEqual('/templates/*')
    })
})
