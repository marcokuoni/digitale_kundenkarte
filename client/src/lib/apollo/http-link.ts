import { HttpLink } from '@apollo/client'

const customFetch = (uri, options) => {
  return fetch(uri, options).then((response) => {
    if (response.redirected) {
      window.location.href = response.url
    }
    return response
  })
}

//!the process.env gets replaced by precompiler
export default new HttpLink({
  uri: `process.env.SERVER_URL/graphql`,
  credentials: 'include',
  fetch: customFetch,
})
