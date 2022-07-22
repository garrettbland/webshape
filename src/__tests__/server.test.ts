var listenMock = jest.fn()
var getAppMock = () => ({
    listen: listenMock,
})
jest.mock('../app', () => ({
    getApp: getAppMock,
}))

import { start } from '../server'

describe('Server', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('Should start the server on a port 3000', async () => {
        listenMock.mockResolvedValue('done')
        await start()
        expect(listenMock).toBeCalledTimes(1)
        expect(listenMock).toBeCalledWith({ port: 3000 })
    })
    it('Should exit the process on error', async () => {
        const processExit = jest
            .spyOn(process, 'exit')
            .mockImplementation((code?: number) => undefined as never)

        listenMock.mockRejectedValue('Error')
        await start()
        expect(processExit).toBeCalledTimes(1)
        expect(processExit).toBeCalledWith(1)
    })
})
