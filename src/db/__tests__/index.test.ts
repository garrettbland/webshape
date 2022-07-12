import * as dbIndex from '../index'

describe('Index', () => {
    it('Should have exports', () => {
        expect(typeof dbIndex.getSiteRouteData).toBe('function')
        expect(typeof dbIndex.supabase).toBe('object')
    })
})
