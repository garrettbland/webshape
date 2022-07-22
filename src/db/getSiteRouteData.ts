import { supabase } from './supabase'

/**
 * Retrieves key/value and template slug for hostname and url.
 */
export const getSiteRouteData = async (HOSTNAME: string, URL: string) => {
    try {
        /**
         * Example getting all rows from 'from' table and all rows from sites table
         * .select('*, template_id ( slug ), sites!inner(*))
         * https://supabase.com/docs/reference/javascript/select#filtering-with-inner-joins
         */
        const { data: site_route_data, error } = await supabase
            .from('site_route_data')
            .select(`key, value, template_id ( slug ), sites!inner(hostname)`)
            .eq('sites.hostname', HOSTNAME)
            .eq('url', URL)

        if (error) {
            throw Error('Supabase error "getSiteRouteData"')
        }

        return site_route_data
    } catch (err) {
        /**
         * TO DO: Track in Log Rocket or something...
         */
        return []
    }
}
