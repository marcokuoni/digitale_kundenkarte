import User, { iCard, iUser } from '../models/user'
import { iUrlTokenPayload } from './urlToken'
import { throwBadReuest } from '../lib/exceptions'

const stampsLength = parseInt(process.env.STAMPS_LENGTH || '8')

export const addStamp = async (
  urlTokenPayload: iUrlTokenPayload,
  user: iUser
) => {
  let card = null
  const userDb = await User.findOne({ _id: user._id })

  if (userDb.cards && userDb.cards.length > 0) {
    card = userDb.cards.sort(
      (a: iCard, b: iCard) =>
        b.creationDate.getTime() - a.creationDate.getTime()
    )[0]
  }

  if (card && card.blockedUntil > new Date()) {
    throwBadReuest('Card is blocked')
  }

  if (!userDb.cards) {
    userDb.cards = []
  }

  const blockedUntil = new Date(
    Date.now() + 1000 * 60 * urlTokenPayload.blockForMinutes
  )

  if (!card) {
    card = _createNewCard(blockedUntil)
    userDb.cards = [card]
    card = userDb.cards[0]
  } else {
    card.blockedUntil = blockedUntil
  }

  if (card && card.stamps.length >= stampsLength) {
    const newCard = _createNewCard(blockedUntil)
    newCard.stamps = [
      {
        creationDate: new Date(),
      },
    ]
    userDb.cards = [newCard, ...userDb.cards]
  } else {
    card.stamps = [
      {
        creationDate: new Date(),
      },
      ...card.stamps,
    ]
  }

  await userDb.save()
  return userDb
}

export const honourCardFrom = async (transfercode: string) => {
  let success = false
  const userDb = await User.findOne({ transfercode })
  if (userDb && userDb.cards && userDb.cards.length > 0) {
    const validCards = userDb.cards.filter(
      (card: iCard) => !card.honouredAt && card.stamps.length === stampsLength
    )
    if (validCards && validCards.length > 0) {
      validCards[0].honouredAt = new Date()
      await userDb.save()
      success = true
    }
  }

  return success
}

const _createNewCard = (blockedUntil: Date) => {
  return {
    creationDate: new Date(),
    blockedUntil,
    stamps: [],
  } as iCard
}
