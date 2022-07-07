/**
 * Validates that incoming request is something that we want to allow to make
 * a database call. Used in Fastifys preHandler hook to check for things like
 * random javascirpt files or other future blacklist type of things such as
 * '/wp-config'
 */
export const isValidRoute = (URL: string): boolean => {
    if (URL.endsWith('.js')) {
        return false
    }
    return true
}

/**
 * Checks domain to see if it includes Renders automatically
 * generated https://webshape-pr-{PR_#}.onrender.com deploy
 * preview.
 */
export const isPullRequest = (HOSTNAME: string): boolean => {
    if (HOSTNAME.includes('webshape-pr-')) {
        return true
    }
    return false
}
