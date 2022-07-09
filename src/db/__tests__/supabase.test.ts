import { createClient } from '../supabase'
import * as supabaseApi from '@supabase/supabase-js'

describe('Supabase', () => {
    it('Should call createClient()', () => {
        const spy = jest.spyOn(supabaseApi, 'createClient').mockReturnValue({} as any)
        createClient()
        expect(spy).toBeCalledTimes(1)
        expect(spy).toBeCalledWith(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
    })
})
