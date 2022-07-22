import { isValidRoute, isPullRequest } from '../hooks'

describe('hooks', () => {
    describe('isValidRoute', () => {
        it('Should return false if request ends with ".js"', async () => {
            const testURL = '/serviceWorker.js'
            expect(isValidRoute(testURL)).toBe(false)
        })
        it('Should return true if request is "/"', async () => {
            const testURL = '/'
            expect(isValidRoute(testURL)).toBe(true)
        })
        it('Should return true if request is "/sub/path"', async () => {
            const testURL = '/sub/path'
            expect(isValidRoute(testURL)).toBe(true)
        })
    })
    describe('isPullRequest', () => {
        it('Should return true if request is PR preview', async () => {
            const testHOSTNAME = 'https://webshape-pr-5.onrender.com'
            expect(isPullRequest(testHOSTNAME)).toBe(true)
        })
        it('Should return false if hostname is not PR preview', async () => {
            const testHOSTNAME = 'https://subdomain.webshape.com'
            expect(isPullRequest(testHOSTNAME)).toBe(false)
        })
    })
})
