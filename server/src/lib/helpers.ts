export const randomTokenString = async () => {
  const crypto = await import('crypto')
  return crypto.randomBytes(40).toString('hex')
}
