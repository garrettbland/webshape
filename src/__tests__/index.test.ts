import * as fastifyApp from '../app'
import * as developmentModules from '../utils/development'

describe('Server', () => {
    it('Should start the server on a port 3000', () => {
        jest.spyOn(developmentModules, 'getPort').mockReturnValueOnce(3000)
        const listenMock = jest.fn()
        jest.spyOn(fastifyApp, 'getApp').mockImplementationOnce(
            () =>
                ({
                    listen: listenMock,
                } as any)
        )

        require('../index')

        expect(listenMock).toBeCalledTimes(1)
        expect(listenMock).toBeCalledWith({ port: 3000 })
    })
})
