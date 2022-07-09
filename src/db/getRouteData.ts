import { createClient } from './supabase'

export const getRouteData = async (HOSTNAME: string, ROUTE: string) => {
    try {
        const { data: test_template_data, error } = await createClient()
            .from('test_template_data')
            .select('key, value')
            .eq('domain', HOSTNAME)
            .eq('route', ROUTE)

        if (error) {
            console.log(error)
            throw Error('Supabase error "getRouteData"')
        }

        return test_template_data
    } catch (err) {
        console.log('There was an error getting data for route', err)
    }
}
