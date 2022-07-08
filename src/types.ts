/**
 * These are technically Squirelly 'filters', but are just for meta/cms use.
 * For example, 'label' filter used in the following example, we wouldn't need
 * this to render the application. We would need it on the CMS side.
 * ```html
 * <p>{{ it.description | content | label('Home Page Description') }}
 * ```
 * Future meta filters could come such as 'defaultValue', 'placeholder', 'required', etc. We
 * still need to use this enum when registering our filters with Squirelly, since the filters
 * will always exist in the HTML, even though we don't use them outside of CMS.
 */
export enum MetaFilters {
    label = 'label',
}

/**
 * Content Filters. These bad boys are registered with Squirelly, and then are used
 * while parsing the HTML to appropriatly build the AST, assign default values, etc.
 * This is also important to know, so for filters such as 'list', we will know that
 * the database will store the data as a JSON. So when we retrieve the dynamic data,
 * we will know to JSON.parse() before running a loop in our template.
 */
export enum Filters {
    text = 'text',
    content = 'content',
    image = 'image',
    list = 'list',
}
