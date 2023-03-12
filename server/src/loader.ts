import { join } from 'path'
import { loadSchema } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { usersResolvers } from './resolvers/user'

export const loadGraphQlSchema = async function () {
  const typeDefs = await loadSchema(join(__dirname, './schemas/**/*.graphql'), {
    loaders: [new GraphQLFileLoader()],
  })
  const resolvers = [usersResolvers]

  return {
    typeDefs,
    resolvers,
  }
}
