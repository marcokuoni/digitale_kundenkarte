import bcrypt from 'bcrypt'

import { iUpdateUser, iUser } from '../models/user'
import { sendValidationMail } from '../services/authEmailValidation'
import { sendMailWithTemplate } from '../services/mail'
import { MAIL_TEMPLATES } from './const'

const saltRounds = parseInt(process.env.SALT_ROUNDS || '10')

export const changePasssword = async (
  values:
    | iUser
    | (iUpdateUser & {
        passwordChangedAt?: Date
        passwordResetToken?: string
      }),
  password: string
) => {
  values.password = await bcrypt.hash(password, saltRounds)
  values.passwordResetToken = undefined
  values.passwordChangedAt = new Date()

  return values
}

export const changeEmail = async (
  newValues:
    | iUser
    | (iUpdateUser & {
        emailValidatedAt?: Date
      }),
  oldValues?: iUser | iUpdateUser
) => {
  if (newValues.email) {
    if (oldValues && oldValues.email && oldValues.email !== newValues.email) {
      await sendMailWithTemplate(
        oldValues.email,
        MAIL_TEMPLATES.EMAIL_CHANGED,
        {
          name: newValues.name,
          oldEMail: oldValues.email,
          newEMail: newValues.email,
        }
      )
    }
    if (!oldValues || oldValues.email !== newValues.email) {
      newValues.emailValidatedAt = undefined
      await sendValidationMail(newValues.email)
    }
  }
}
