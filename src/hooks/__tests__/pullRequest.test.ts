var pullRequest = jest.fn()
jest.mock('../../controllers/pullRequest', () => ({
    pullRequest: pullRequest,
}))

import { checkPullRequest } from '../pullRequest'
import * as hooksModule from '../../utils/hooks'

describe('Pull Request Hook', () => {
    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('Should return callback function if not a PR', () => {
        jest.spyOn(hooksModule, 'isPullRequest').mockReturnValue(false)
        const cbMock = jest.fn()
        checkPullRequest({} as any, {} as any, cbMock)
        expect(cbMock).toBeCalledTimes(1)
    })
    it('Should return pullRequest controller if PR', () => {
        jest.spyOn(hooksModule, 'isPullRequest').mockReturnValue(true)
        checkPullRequest({} as any, {} as any, () => {})
        expect(pullRequest).toBeCalledTimes(1)
    })
})
