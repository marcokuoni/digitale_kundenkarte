import { GraphQLError } from 'graphql'
import { AUTH_TOKEN_SEPERATOR, CODES, STATES } from './const'

export const throwBadReuest = (message: string) => {
  throw new GraphQLError(message, {
    extensions: {
      code: CODES.BAD_REQUEST,
      http: { status: STATES.BAD_REQUEST },
    },
  })
}

export const throwUnauthenticated = (message: string) => {
  throw new GraphQLError(message, {
    extensions: {
      code: CODES.UNAUTHENTICATED,
      http: { status: STATES.UNAUTHENTICATED },
    },
  })
}

export const throwForbidden = (message: string) => {
  throw new GraphQLError(message, {
    extensions: {
      code: CODES.FORBIDDEN,
      http: { status: STATES.FORBIDDEN },
    },
  })
}

export const throwRedirectError = (successRedirect: string, token: string) => {
  throw new GraphQLError('login', {
    extensions: {
      code: CODES.LOGIN,
      http: {
        status: STATES.REDIRECT,
        headers: new Map([
          [
            'Location',
            `${process.env.CLIENT_URL}${successRedirect}${AUTH_TOKEN_SEPERATOR}${token}`,
          ],
        ]),
      },
    },
  })
}
