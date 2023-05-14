import bcrypt from 'bcrypt'

import { iUpdateUser, iUser } from '../models/user'
import { sendValidationMail } from '../services/authEmailValidation'

const saltRounds = parseInt(process.env.SALT_ROUNDS || '10')

export const changePasssword = async (values: iUser | iUpdateUser & {
    passwordChangedAt?: Date;
    passwordResetToken?: string
}, password: string) => {
    values.password = await bcrypt.hash(password, saltRounds)
    values.passwordResetToken = undefined
    values.passwordChangedAt = new Date()

    return values
}

export const changeEmail = async (values: iUser | iUpdateUser & {
    emailValidatedAt?: Date
}, email: string) => {
    values.email = email
    values.emailValidatedAt = undefined
    await sendValidationMail(email)

    return values
}