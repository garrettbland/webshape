/**
 * Returns the pathname from the generated 'URL'. Typically used for getting
 * route from a server request.
 *
 * Example usage requesting path "https://xxx.com/a/b/c"...
 * ```js
 * import { getPathName } from './path'
 *
 * const { protocol, hostname, url } = request
 *
 * getPathName(protocol, hostname, url) ==> '/a/b/c'
 * ```
 */
export const getPathName = (PROTOCOL: string, HOSTNAME: string, ROUTE: string): string => {
    return new URL(`${PROTOCOL}://${HOSTNAME}${ROUTE}`)?.pathname
}
