import { validateRoute, checkPullRequestDomain } from '../hooks'
import { getApp } from '../../app'
import * as template from '../../template'

let app: any

beforeAll(() => {
    jest.spyOn(template, 'build').mockResolvedValue('<p>Example HTML</p>')
    app = getApp()
})

afterAll(() => {
    /**
     * Restore environment
     */
    jest.resetAllMocks()
})

describe('hooks', () => {
    describe('validateRoute', () => {
        it('Should return 404 if request ends with ".js"', async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/serviceWorker.js',
            })

            expect(response.statusCode).toBe(404)
        })
        it('Should return 200 if request is valid', async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/',
            })

            expect(response.statusCode).toBe(200)
        })
    })
    describe('checkPullRequestDomain', () => {
        it.todo('Should forward request to pullRequest controller if pull request')
        it.todo('Should call Fastifys done method if request is not pull request')
    })
})
