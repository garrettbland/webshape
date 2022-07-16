// WORKS
// var listenMock = jest.fn().mockResolvedValue('done')
// jest.mock('../app', () => ({
//     getApp: () => ({
//         listen: listenMock,
//     }),
// }))

var listenMock = jest.fn()
jest.mock('../app', () => ({
    getApp: () => ({
        listen: listenMock,
    }),
}))

import { start } from '../server'

describe('Server', () => {
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
