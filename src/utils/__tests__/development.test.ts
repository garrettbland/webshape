import { getPort, isDevelopment } from '../development'

describe('development', () => {
    const CURRENT_ENV = process.env

    beforeEach(() => {
        jest.resetModules()
        process.env = { ...CURRENT_ENV }
    })

    afterAll(() => {
        /**
         * Restore environment
         */
        process.env = CURRENT_ENV
    })

    it('getPort should return integer 3000 by default', () => {
        expect(getPort()).toBe(3000)
    })
    it('getPort should return environment variable if set', () => {
        process.env.PORT = '8080'
        expect(getPort()).toBe(8080)
    })
    it('isDevelopment should return true if env.ENVIRONMENT is set to "DEVELOPMENT"', () => {
        process.env.ENVIRONMENT = 'DEVELOPMENT'
        expect(isDevelopment()).toBe(true)
    })
    it('isDevelopment should return false if env.ENVIRONMENT isn\'t "DEVELOPMENT"', () => {
        process.env.ENVIRONMENT = 'PRODUCTION'
        expect(isDevelopment()).toBe(false)
    })
})
