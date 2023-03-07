import { loadSchema } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { moviesResolvers } from './resolvers/movie.js'

export const loadGraphQlSchema = async function () {
  const typeDefs = await loadSchema('./schemas/**/*.graphql', {
    loaders: [new GraphQLFileLoader()],
  })
  const resolvers = [moviesResolvers]

  return {
    typeDefs,
    resolvers,
  }
}
