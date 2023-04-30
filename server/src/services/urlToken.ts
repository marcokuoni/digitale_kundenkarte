import { GraphQLError } from 'graphql'
import * as jwt from 'jsonwebtoken'
import type Jwt from 'jsonwebtoken'

const jwtUrlTokenKey = process.env.JWT_URL_TOKEN_KEY as Jwt.Secret
export interface iUrlTokenPayload {
    validUntil: Date
    blockForMinutes: number
}

export const generateUrlToken = (validUntil: Date, blockForMinutes: number) => {
  const payload: iUrlTokenPayload = {
    validUntil,
    blockForMinutes,
  }
  const token = jwt.sign(payload, jwtUrlTokenKey, {
    algorithm: 'HS256',
    expiresIn: validUntil.getTime() - Date.now(),
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
