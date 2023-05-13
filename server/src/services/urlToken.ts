import { GraphQLError } from 'graphql'
import * as jwt from 'jsonwebtoken'
import type Jwt from 'jsonwebtoken'

const jwtUrlTokenKey = process.env.JWT_URL_TOKEN_KEY as Jwt.Secret
export interface iUrlTokenPayload {
    blockForMinutes: number
}

export const generateUrlToken = (validUntil: Date, blockForMinutes: number) => {
  const payload: iUrlTokenPayload = {
    blockForMinutes,
  }

  const token = jwt.sign(payload, jwtUrlTokenKey, {
    algorithm: 'HS256',
    expiresIn: Math.round((validUntil.getTime() - Date.now()) / 1000),
  })
  return {
    token,
    validUntil,
    blockForMinutes,
  }
}

export const getPaylodFromUrlToken = (urlToken: string) => {
  try {
    const payload = jwt.verify(urlToken, jwtUrlTokenKey, {
      algorithms: ['HS256'],
    })
    return payload as iUrlTokenPayload
  } catch (error) {
    console.error(error)
    throw new GraphQLError('Invalid Url Token', {
      extensions: {
        code: 'BAD_REQUEST',
        http: { status: 400 },
      },
    })
  }
}
