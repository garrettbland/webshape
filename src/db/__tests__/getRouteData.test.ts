import { getRouteData } from '../getRouteData'
import * as supabaseUtil from '../supabase'

describe('Get Route Data', () => {
    it('Should return an array of objects with key/values', async () => {
        jest.spyOn(supabaseUtil.supabase, 'from').mockImplementation(
            () =>
                ({
                    select: () => ({
                        eq: () => ({
                            eq: () => ({
                                data: [{ key: 'title', value: 'Rays Flowers' }],
                            }),
                        }),
                    }),
                } as any)
        )

        const testKeyValues = await getRouteData('https://example.com', '/')

        expect(testKeyValues).toStrictEqual([
            {
                key: 'title',
                value: 'Rays Flowers',
            },
        ])
    })

    it('Should throw if error is sent from supabase', async () => {
        try {
            jest.spyOn(supabaseUtil.supabase, 'from').mockImplementation(
                () =>
                    ({
                        select: () => ({
                            eq: () => ({
                                eq: () => ({
                                    data: [],
                                    error: 'Heck error',
                                }),
                            }),
                        }),
                    } as any)
            )

            await getRouteData('https://example.com', '/')
        } catch (err) {
            expect(err).toBe('Supabase error "getRouteData"')
        }
    })
})
