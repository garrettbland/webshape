import { supabase } from './supabase'
import { RouteData } from '../types'

/**
 * Retrieves data for specific route and hostname. Data is stored
 * in database with hostname, route, key, value. This makes getting the
 * required data easy, and we only return what we need. (key and value)
 */
export const getRouteData = async (
    HOSTNAME: string,
    ROUTE: string
): Promise<RouteData[] | undefined> => {
    try {
        const { data: test_template_data, error } = await supabase
            .from('test_template_data')
            .select('key, value')
            .eq('domain', HOSTNAME)
            .eq('route', ROUTE)

        if (error) {
            throw Error('Supabase error "getRouteData"')
        }

        return test_template_data
    } catch (err) {
        console.log('There was an error getting data for route', err)
    }
}
