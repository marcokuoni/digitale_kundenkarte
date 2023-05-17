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
    VERIFY_EMAIL = 'verify-email',
    FORGOT_TRANSFERCODE = 'forgot-transfercode',
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
    BLOCKING_DURATION_MS = 'process.env.BLOCKING_DURATION_MS',
    CROWN_BAR_URL = 'process.env.CROWN_BAR_URL',
    CROWN_BAR_INSTA = 'process.env.CROWN_BAR_INSTA',
    ADMIN_EMAIL_ADDRESS = 'process.env.ADMIN_EMAIL_ADDRESS',
}

export enum CODES {
    BAD_REQUEST = 'BAD_REQUEST',
    UNAUTHENTICATED = 'UNAUTHENTICATED',
    FORBIDDEN = 'FORBIDDEN',
}

export enum BUTTON_TYPES {
    BUTTON = 'button',
    SUBMIT = 'submit',
}

export enum INPUT_TYPES {
    TEXT = 'text',
    CHECKBOX = 'checkbox',
    HIDDEN = 'hidden',
    EMAIL = 'email',
    PASSWORD = 'password',
    DATETIME_LOCAL = "datetime-local"
}

export enum TARGETS {
    BLANK = '_blank',
    SELF = '_self',
}

export enum KEYS {
    ESCAPE = 'Escape'
}

export enum EVENTS {
    KEYDOWN = 'keydown',
    APOLLO_ERROR = 'apolloError',
    OFFLINE = 'offline',
    ONLINE = 'online'
}

export enum OVERFLOW {
    HIDDEN = 'hidden'
}

export enum PARAMS {
    TRANSFERCODE = 'transfercode',
    URL_TOKEN = 'urlToken',
    WITH_PASSWORD = 'withPassword',
    TOKEN = 'token',
}

export enum NAMES {
    TRANSFERCODE = 'transfercode',
    IP = 'ip',
    BLOCKED_UNTIL = 'blockedUntil',
    LONG_TIME_QR = 'longTimeQr',
    VALID_UNTIL = 'validUntil',
    BLOCK_FOR_MINUTES = 'blockForMinutes',
    ID = '_id',
    USER_ROLES = 'userRoles',
    NAME = 'name',
    EMAIL = 'email',
    NEWSLETTER = 'newsletter',
    PASSWORD = 'password',
}

export enum TIME_UNIT {
    SECOND = 'second',
    MINUTE = 'minute',
    HOUR = 'hour',
    DAY = 'day',
}

export const AUTHORIZATION = 'authorization'
export const BEARER = 'Bearer'
export const AUTH_TOKEN_SEPERATOR = `?${AUTHORIZATION}=`
export const DE_CH = 'de-CH'
export const QR_CODE_API_URL = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data='
export const RECEIVED_CODE_503 = 'Received status code 503'
export const NOOPENER_NPREFERRER = 'noopener noreferrer'
export const TRUE = 'true'
export const PLACEHOLDER_IP = '::ffff:172.18.0.5'
export const MAIL_TO = 'mailto:'