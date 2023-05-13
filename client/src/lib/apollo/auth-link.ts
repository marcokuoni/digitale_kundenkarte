import { ApolloLink } from '@apollo/client'

import { BEARER, AUTHORIZATION, PROCESS_ENV } from '../const'

type Headers = {
  authorization?: string
}

export default new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(PROCESS_ENV.JWT_COOKIE_NAME)

  operation.setContext(({ headers }: { headers: Headers }) => ({
    headers: {
      ...headers,
      authorization: `${BEARER} ${token}`,
    },
  }))

  return forward(operation).map((result) => {
    const headers = operation.getContext().response.headers
    let jwtAccessToken = headers.get(AUTHORIZATION)
        
    if (jwtAccessToken && jwtAccessToken.indexOf(`${BEARER} `) >= 0) {
      jwtAccessToken = jwtAccessToken.split(' ')[1]
      localStorage.setItem(PROCESS_ENV.JWT_COOKIE_NAME, jwtAccessToken)
    }

    return result
  })
})
