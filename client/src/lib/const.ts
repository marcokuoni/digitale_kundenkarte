export enum PATHS {
    HOME = '',
    CARD = 'card',
    CREATE_USER = 'create-user',
    LOGIN_USER = 'login-user',
    SETTINGS = 'settings',
    PROFILE = 'profile',
    CONNECTED = 'connected',
    IP_BLOCKS = 'ip-blocks',
    QR_CODE = 'qr-code',
    ADD_STAMP = 'add-stamp',
    HONOUR_CARD = 'honour-card',
    WITH_PASSWORD = 'with-password',
    USER_ROLES = 'user-roles',
    FORGOT_PASSWORD = 'forgot-password',
    RESET_PASSWORD = 'reset-password',
}

export enum USER_ROLES {
    ADMIN = 'admin',
    EMPLOYEE = 'employee',
}

export enum TYPENAME {
    STAMP = 'Stamp',
    CARD = 'Card'
}

export enum FETCH_POLICY {
    CACHE_FIRST = 'cache-first',
    CACHE_ONLY = 'cache-only',
    NETWORK_ONLY = 'network-only',
}

export enum ERROR_POLICY {
    IGNORE = 'ignore'
}

export enum PROCESS_ENV {
    SERVER_URL = 'process.env.SERVER_URL',
    SCHEMA_VERSION = 'process.env.SCHEMA_VERSION',
    SCHEMA_VERSION_KEY = 'process.env.SCHEMA_VERSION_KEY',
    JWT_COOKIE_NAME = 'process.env.JWT_COOKIE_NAME',
    DEFAULT_URL_TOKEN_BLOCK_FOR_MINUTES = 'process.env.DEFAULT_URL_TOKEN_BLOCK_FOR_MINUTES',
    DEFAULT_URL_TOKEN_VALID_FOR_MINUTES = 'process.env.DEFAULT_URL_TOKEN_VALID_FOR_MINUTES',
    STAMPS_LENGTH = 'process.env.STAMPS_LENGTH',
    CLIENT_PING_INTERVAL = 'process.env.CLIENT_PING_INTERVAL',
    SERVER_REQUEST_COUNT_CHECK_INTERVAL = 'process.env.SERVER_REQUEST_COUNT_CHECK_INTERVAL',
    CHECK_FOR_HOW_MANY_CYCLES = 'process.env.CHECK_FOR_HOW_MANY_CYCLES',
}

export const AUTHORIZATION = 'authorization'
export const BEARER = 'Bearer'
export const AUTH_TOKEN_SEPERATOR = `?${AUTHORIZATION}=`
