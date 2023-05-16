import * as jwt from 'jsonwebtoken'
import type Jwt from 'jsonwebtoken'

import { throwBadReuest } from '../lib/exceptions'
import User, { iUser } from '../models/user'
import { randomTokenString } from '../lib/helpers'
import { sendMailWithTemplate } from './mail'
import { MAIL_TEMPLATES } from '../lib/const'

const emailValidateKey = process.env.EMAIL_VALIDATE_SECRET as Jwt.Secret
const jwtEmailValidateExpiry = parseInt(
  process.env.EMAIL_VALIDATE_EXPIRES_IN || '0'
)

interface ValidateEmailPayloadInerface {
  token: string
}

export const sendValidationMail = async (email: string) => {
  let hasOldValidToken = false
  const user = await User.findOne({ email })
  if (!user || !user.email || user.emailValidatedAt) {
    throwBadReuest('Bad Validation Request')
  }

  if (user) {
    if (user.emailValidateToken) {
      try {
        jwt.verify(
          user.emailValidateToken,
          emailValidateKey
        ) as ValidateEmailPayloadInerface
        hasOldValidToken = true
      } catch (e) {
        console.error(e)
      }
    }

    const payload: ValidateEmailPayloadInerface = {
      token: user._id,
    }

    const validateToken = jwt.sign(payload, emailValidateKey, {
      algorithm: 'HS256',
      expiresIn: jwtEmailValidateExpiry,
      issuer: process.env.SERVER_URL || 'https://karte.localhost',
      audience: process.env.CLIENT_URL || 'https://karte.localhost',
      jwtid: randomTokenString(),
    })

    user.emailValidateToken = validateToken
    await user.save()

    if (user.email) {
      await sendMailWithTemplate(user.email, MAIL_TEMPLATES.VERIFY_EMAIL, {
        name: user.name,
        validateToken,
        hasOldValidToken,
      })
    }
  }
}

export const validateEmail = async (token: string) => {
  let payload: ValidateEmailPayloadInerface | undefined = undefined
  try {
    payload = jwt.verify(
      token,
      emailValidateKey
    ) as ValidateEmailPayloadInerface
  } catch (e) {
    console.error(e)
    throwBadReuest('Bad Token')
  }

  let user: (iUser & { save: () => Promise<iUser> }) | null = null
  if (!payload || !payload.token) {
    throwBadReuest('Bad Token')
  } else {
    user = await User.findById(payload.token)
  }

  if (!user || !user.emailValidateToken || user.emailValidateToken !== token) {
    throwBadReuest('Bad Token')
  } else {
    user.emailValidateToken = undefined
    user.emailValidatedAt = new Date()

    await user.save()
  }
}
