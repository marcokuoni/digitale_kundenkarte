import User from '../models/user'
import RefreshToken from '../models/refreshToken'
import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'
import {
  signIn,
  signUp,
  refresh,
  signOut,
  checkAccessRights,
  revokeRefreshTokenManualy,
} from '../services/auth'
import type { ServerContext } from '../server_types'

export interface iNewUser {
  name?: string
  email?: string
  newsletter: boolean
  password?: string
}

interface iUpdateUser {
  name: string
  email: string
  newsletter: boolean
  password?: string
}

export const usersResolvers = {
  Date: new GraphQLScalarType<Date | null, number>({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value as string) // value from the client
    },
    serialize(value) {
      return (value as Date).getTime() // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value) // ast value is always in string format
      }
      return null
    },
  }),
  Query: {
    async getUsers() {
      return User.find()
    },
    async getCurrentUser(root: never, args: never, context: ServerContext) {
      checkAccessRights(context.user)
      return context.user
    },
    //TODO: API for get all refresh tokens which are not revoked from user with ip and the possability to delete revoke them
    async getActiveRefreshTokens(
      root: never,
      args: never,
      context: ServerContext
    ) {
      checkAccessRights(context.user)
      if (context.user) {
        //@ts-ignore
        return RefreshToken.find({
          user: context.user._id,
          revoked: { $exists: false },
        }).exec()
      }
      return []
    },
  },
  Mutation: {
    async updateUser(
      root: never,
      { _id, name, email, newsletter, password }: { _id: string } & iUpdateUser
    ) {
      const values: iUpdateUser = {
        name,
        email,
        newsletter,
      }
      if (password) {
        values.password = password
      }

      return await User.findOneAndUpdate({ _id }, values, { new: true })
    },
    async signIn(
      root: never,
      {
        transfercode,
        password,
        successRedirect,
      }: {
        transfercode: string
        password: string
        successRedirect: string
      },
      context: ServerContext
    ) {
      await signIn(context.req, context.res, successRedirect, transfercode, password)
      return true
    },
    async signUp(root: never, newUser: iNewUser & {successRedirect?: string}, context: ServerContext) {
      const successRedirect = newUser.successRedirect
      delete newUser.successRedirect
      await signUp(context.req, context.res, successRedirect || '/', newUser)
      return true
    },
    async refresh(root: never, args: never, context: ServerContext) {
      await refresh(context.req, context.res)
      return true
    },
    async signOut(root: never, args: never, context: ServerContext) {
      await signOut(context.req, context.res)
      return true
    },
    async revokeRefreshToken(
      root: never,
      { _id }: { _id: string },
      context: ServerContext
    ) {
      await revokeRefreshTokenManualy(context.req, _id)
      return true
    },
  },
}
