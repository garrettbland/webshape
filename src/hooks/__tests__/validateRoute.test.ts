var notFound = jest.fn()
jest.mock('../../controllers/notFound', () => ({
    notFound: notFound,
}))

import { validateRoute } from '../validateRoute'
import * as hooksModule from '../../utils/hooks'

describe('Pull Request Hook', () => {
    afterEach(() => {
        jest.restoreAllMocks()
        jest.clearAllMocks()
    })

    it('Should return callback function if valid route', () => {
        jest.spyOn(hooksModule, 'isValidRoute').mockReturnValue(true)
        const cbMock = jest.fn()
        validateRoute({} as any, {} as any, cbMock)
        expect(cbMock).toBeCalledTimes(1)
    })
    it('Should return notFound controller if invalid route', () => {
        jest.spyOn(hooksModule, 'isValidRoute').mockReturnValue(false)
        validateRoute({} as any, {} as any, () => {})
        expect(notFound).toBeCalledTimes(1)
    })
})
