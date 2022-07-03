import { supabase } from './supabase'

interface ResponseType {
    domain: string
    route: string
    templates: {
        template: string
    }
}

/**
 * Gets the template for the requested route and hostname.
 *
 * TODO: Do a join between site_page_template and templates table.
 * Otherwise this results in two calls to supabase.
 */
export const getRouteTemplate = async (HOSTNAME: string, ROUTE: string) => {
    try {
        const { data: page_template, error } = await supabase
            .from('site_page_template')
            .select(`domain, route, templates ( template )`)
            .eq('domain', HOSTNAME)
            .eq('route', ROUTE)
            .limit(1)

        if (error) {
            console.log(error)
            throw Error('Database call go bang')
        }

        const TEMPLATE = (page_template as ResponseType[])[0].templates.template

        return TEMPLATE
    } catch (err) {
        console.log('There was an error getting template for route', err)
    }
}
