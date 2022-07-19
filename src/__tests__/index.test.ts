import * as serverModule from '../server'

describe('Index', () => {
    it('Should execute the start() method from server', async () => {
        var spy = jest.spyOn(serverModule, 'start').mockResolvedValue()
        require('../index')
        expect(spy).toBeCalledTimes(1)
    })
})
