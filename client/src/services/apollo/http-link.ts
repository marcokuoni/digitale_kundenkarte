import { HttpLink } from '@apollo/client'
import { AUTH_TOKEN_SEPERATOR, PROCESS_ENV } from '../../lib/const'

const customFetch = (uri, options) => {
  return fetch(uri, options).then((response) => {
    if (response.redirected) {
      const urlSplitted = response.url.split(AUTH_TOKEN_SEPERATOR)
      if (urlSplitted.length > 1) {
        const jwtAccessToken = urlSplitted[1]
        localStorage.setItem(PROCESS_ENV.JWT_COOKIE_NAME, jwtAccessToken)
      }
      window.location.href = urlSplitted[0]
    }
    return response
  })
}

export default new HttpLink({
  uri: `${PROCESS_ENV.SERVER_URL}/graphql`,
  credentials: 'include',
  fetch: customFetch,
})
