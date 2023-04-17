import { HttpLink } from '@apollo/client'

//!the process.env gets replaced by precompiler
export default new HttpLink({ uri: `process.env.SERVER_URL/graphql`, credentials: 'include' })