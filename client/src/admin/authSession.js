const TOKEN_KEY = 'token'

export const getAuthToken = () => window.sessionStorage.getItem(TOKEN_KEY)

export const setAuthToken = (token) => {
    window.localStorage.removeItem(TOKEN_KEY)
    window.sessionStorage.setItem(TOKEN_KEY, token)
}

export const clearAuthToken = () => {
    window.sessionStorage.removeItem(TOKEN_KEY)
    window.localStorage.removeItem(TOKEN_KEY)
}

export const clearLegacyAuthToken = () => {
    window.localStorage.removeItem(TOKEN_KEY)
}
