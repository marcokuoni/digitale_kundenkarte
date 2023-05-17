import * as jwt from 'jsonwebtoken'
import type Jwt from 'jsonwebtoken'

import { throwBadReuest } from '../lib/exceptions'
import User, { iUser } from '../models/user'
import { randomTokenString } from '../lib/helpers'
import { sendMailWithTemplate } from './mail'
import { MAIL_TEMPLATES } from '../lib/const'
import { changePasssword } from '../lib/userHelper'

const emailResetKey = process.env.EMAIL_RESET_SECRET as Jwt.Secret
const jwtEmailResetExpiry = parseInt(process.env.EMAIL_RESET_EXPIRES_IN || '0')

interface ResetPasswordPayloadInerface {
  token: string
}

export const resetPassword = async (email: string) => {
  const user = await User.findOne({ email })
  let hasOldValidToken = false

  if (user && user.email && user.emailValidatedAt) {
    if (user.passwordResetToken) {
      try {
        jwt.verify(user.passwordResetToken, emailResetKey, {
          algorithms: ['HS256'],
        }) as ResetPasswordPayloadInerface
        hasOldValidToken = true
      } catch (e) {
        console.error(e)
      }
    }

    const payload: ResetPasswordPayloadInerface = {
      token: user._id,
    }

    const jwtid = await randomTokenString()
    const resetToken = jwt.sign(payload, emailResetKey, {
      algorithm: 'HS256',
      expiresIn: jwtEmailResetExpiry,
      issuer: process.env.SERVER_URL || 'https://karte.localhost',
      audience: process.env.CLIENT_URL || 'https://karte.localhost',
      jwtid,
    })

    user.passwordResetToken = resetToken
    await user.save()

    await sendMailWithTemplate(user.email, MAIL_TEMPLATES.RESET_PASSWORD, {
      name: user.name,
      resetToken,
      hasOldValidToken,
    })
  }
}

export const setNewPassword = async (token: string, password: string) => {
  let payload: ResetPasswordPayloadInerface | undefined = undefined
  try {
    payload = jwt.verify(token, emailResetKey, {
      algorithms: ['HS256'],
    }) as ResetPasswordPayloadInerface
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

  if (
    !user ||
    !user.passwordResetToken ||
    !user.email ||
    user.passwordResetToken !== token
  ) {
    throwBadReuest('Bad Token')
  } else {
    await changePasssword(user, password)

    await user.save()

    await sendMailWithTemplate(user.email, MAIL_TEMPLATES.PASSWORD_CHANGED, {
      name: user.name,
    })
  }
}
