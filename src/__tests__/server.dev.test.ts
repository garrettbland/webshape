var getAppMock = jest.fn()
jest.mock('../app', () => ({
    getApp: getAppMock,
}))

jest.mock('../utils/development', () => ({
    isDevelopment: jest.fn(() => true),
    getPort: jest.fn(() => 3000),
}))

import * as serverModule from '../server'

describe('Development Server', () => {
    it('Should start the server with pino-pretty enabled', () => {
        jest.spyOn(serverModule, 'start').mockResolvedValue('done' as any)

        serverModule.start()
        expect(getAppMock).toBeCalledTimes(1)
        expect(getAppMock).toBeCalledWith({
            logger: {
                transport: {
                    target: 'pino-pretty',
                    options: {
                        translateTime: 'HH:MM:ss Z',
                        ignore: 'pid,hostname,time',
                    },
                },
            },
        })
    })
})
