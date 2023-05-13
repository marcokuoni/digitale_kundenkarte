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
    SETTINGS = 'settings',
    PROFILE = 'profile',
    CONNECTED = 'connected',
    VERIFY_EMAIL = 'verify-email',
}
export enum MAIL_TEMPLATES {
    RESET_PASSWORD = 'reset-password',
    TOKEN_USED_TWICE = 'token-used-twice',
    DIFFERENT_DEVICE = 'different-device',
    CREATED_FROM_UNKNOWN_DEVICE = 'created-from-unknown-device',
    MORE_THEN_ALLOWED_CONNECTED_DEVICES = 'more-then-allowed-connected-devices',
    VERIFY_EMAIL = 'verify-email',
}