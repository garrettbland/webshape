import { getSiteRouteData } from '../getSiteRouteData'
import * as supabaseUtil from '../supabase'

describe('Get Route Data', () => {
    it('Should return an array of objects with key/values', async () => {
        jest.spyOn(supabaseUtil.supabase, 'from').mockImplementation(
            () =>
                ({
                    select: () => ({
                        eq: () => ({
                            eq: () => ({
                                data: [
                                    {
                                        key: 'title',
                                        value: 'Rays Flowers',
                                        template_id: { slug: 'example_template' },
                                        sites: {
                                            hostname: 'webshape.dev',
                                        },
                                    },
                                ],
                            }),
                        }),
                    }),
                } as any)
        )

        const testKeyValues = await getSiteRouteData('https://example.com', '/')

        expect(testKeyValues).toStrictEqual([
            {
                key: 'title',
                value: 'Rays Flowers',
                template_id: { slug: 'example_template' },
                sites: {
                    hostname: 'webshape.dev',
                },
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
            await getSiteRouteData('https://example.com', '/')
        } catch (err) {
            expect(err).toBe('Supabase error "getSiteRouteData"')
        }
    })
})
