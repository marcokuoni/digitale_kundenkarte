import { HttpLink } from '@apollo/client'
import { AUTH_TOKEN_SEPERATOR, PROCESS_ENV, PRODUCTION } from '../../lib/const'

const production = PROCESS_ENV.NODE_ENV.toString() === PRODUCTION

const _customFetch = async (uri, options) => {
  try {
    const response = await fetch(uri, options)

    if (response.redirected) {
      const urlSplit = response.url.split(AUTH_TOKEN_SEPERATOR)

      if (urlSplit.length > 1) {
        const jwtAccessToken = urlSplit[1]
        localStorage.setItem(PROCESS_ENV.JWT_COOKIE_NAME, jwtAccessToken)
      }
      window.location.href = urlSplit[0]
    }

    return response

  } catch (e) {
    !production && console.error('error in custom fetch:')
    !production && console.error(e)
  }
}

export default new HttpLink({
  uri: `${PROCESS_ENV.SERVER_URL}/graphql`,
  credentials: 'include',
  fetch: _customFetch,
})
