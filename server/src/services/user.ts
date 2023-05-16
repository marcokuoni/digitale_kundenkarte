import { iUpdateUser, iUser } from '../models/user'
import User from '../models/user'
import { randomTokenString } from '../lib/helpers'
import { MAIL_TEMPLATES, USER_ROLES } from '../lib/const'
import { changeEmail, changePasssword } from '../lib/userHelper'
import { sendMailWithTemplate } from './mail'

export const updateUser = async (
  _id: string,
  values: iUpdateUser,
  currentUser: iUser
) => {
  const newValues: iUpdateUser & {
    passwordChangedAt?: Date
    emailValidatedAt?: Date
  } = { ...values }
  if (newValues.password) {
    await changePasssword(newValues, newValues.password)
  }

  await changeEmail(newValues, currentUser)

  return await User.findOneAndUpdate({ _id }, newValues, { new: true })
}

export const createUser = async (values: iUpdateUser) => {
  let transfercode = _generateTransfercode()
  while (await _isTransfercodeExisting(transfercode)) {
    transfercode = _generateTransfercode()
  }

  const newValues: iUpdateUser & {
    passwordChangedAt?: Date
    emailValidatedAt?: Date
    userRoles?: string[]
    transfercode: string
  } = {
    ...values,
    transfercode: _formatTransfercode(transfercode),
  }

  const count = await User.countDocuments()
  if (count === 0) {
    newValues.userRoles = [USER_ROLES.ADMIN]
    if (!newValues.password) {
      newValues.password = randomTokenString()
    }
  }

  if (newValues.password) {
    await changePasssword(newValues, newValues.password)
  }

  await changeEmail(newValues)

  return await User.create({
    ...newValues,
  })
}

export const resendTransfercode = async (email: string) => {
  const user = await User.findOne({ email })
  if (user && user.email && user.emailValidatedAt) {
    await sendMailWithTemplate(user.email, MAIL_TEMPLATES.RESEND_TRANSFERCODE, {
      transfercode: user.transfercode,
    })
  }
}

const _isTransfercodeExisting = async (transfercode: number) => {
  const user = await User.findOne({
    transfercode: _formatTransfercode(transfercode),
  })
  return user !== null
}

const _generateTransfercode = () => {
  return Math.floor(Math.random() * 999999) // Generates a random number between 0 and 999999
}

const _formatTransfercode = (transfercode: number) => {
  return '000000'.substring(String(transfercode).length) + transfercode
}
