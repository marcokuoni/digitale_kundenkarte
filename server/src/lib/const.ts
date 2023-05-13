export const AUTHORIZATION = 'authorization'
export const BEARER = 'Bearer'
export const ACCESS_CONTROL_EXPOSE_HEADERS = 'Access-Control-Expose-Headers'
export const USER_AGENT = 'user-agent'
export const UNKNOWN = 'unknown'
export const AUTH_TOKEN_SEPERATOR = `?${AUTHORIZATION}=`
export const PRODUCTION = 'production'

export enum USER_ROLES {
    ADMIN = 'admin',
    EMPLOYEE = 'employee',
}
export enum PATHS {
    RESET_PASSWORD = 'reset-password',
}