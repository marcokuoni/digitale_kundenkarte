import client from "./lib/apollo/client";
import type {
        ApolloQueryResult, ObservableQuery, WatchQueryOptions, QueryOptions, MutationOptions
      } from "@apollo/client";
import { readable } from "svelte/store";
import type { Readable } from "svelte/store";
import gql from "graphql-tag"
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

export type Card = {
  __typename?: 'Card';
  creationDate: Scalars['Date'];
  honouredAt?: Maybe<Scalars['Date']>;
  stamps: Array<Maybe<Stamp>>;
};

export type IpBlock = {
  __typename?: 'IpBlock';
  _id: Scalars['ID'];
  blockedUntil: Scalars['Date'];
  createdAt: Scalars['Date'];
  ip: Scalars['String'];
  updatedAt: Scalars['Date'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addIpBlock: Scalars['Boolean'];
  addStamp: Scalars['Boolean'];
  deleteIpBlock: Scalars['Boolean'];
  generateUrlToken: UrlToken;
  honourCardFrom: Scalars['Boolean'];
  refresh: Scalars['Boolean'];
  revokeRefreshToken: Scalars['Boolean'];
  signIn: Scalars['Boolean'];
  signOut: Scalars['Boolean'];
  signUp: Scalars['Boolean'];
  updateUser: User;
};


export type MutationAddIpBlockArgs = {
  blockedUntil: Scalars['Date'];
  ip: Scalars['String'];
};


export type MutationAddStampArgs = {
  urlToken: Scalars['String'];
};


export type MutationDeleteIpBlockArgs = {
  _id: Scalars['ID'];
};


export type MutationGenerateUrlTokenArgs = {
  blockForMinutes: Scalars['Int'];
  validUntil: Scalars['Date'];
};


export type MutationHonourCardFromArgs = {
  transfercode: Scalars['String'];
};


export type MutationRevokeRefreshTokenArgs = {
  _id: Scalars['ID'];
};


export type MutationSignInArgs = {
  password?: InputMaybe<Scalars['String']>;
  successRedirect: Scalars['String'];
  transfercode: Scalars['String'];
};


export type MutationSignUpArgs = {
  email?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  newsletter: Scalars['Boolean'];
  password?: InputMaybe<Scalars['String']>;
  successRedirect: Scalars['String'];
};


export type MutationUpdateUserArgs = {
  _id: Scalars['ID'];
  email?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  newsletter: Scalars['Boolean'];
  password?: InputMaybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  getActiveRefreshTokens: Array<Maybe<RefreshToken>>;
  getCurrentUser: User;
  getIpBlocks: Array<Maybe<IpBlock>>;
  getUsers: Array<Maybe<User>>;
};

export type RefreshToken = {
  __typename?: 'RefreshToken';
  _id: Scalars['ID'];
  created: Scalars['Date'];
  createdAt: Scalars['Date'];
  createdByIp: Scalars['String'];
  createdByUserAgent: Scalars['String'];
  expires: Scalars['Date'];
  updatedAt: Scalars['Date'];
  user: User;
};

export type Stamp = {
  __typename?: 'Stamp';
  creationDate: Scalars['Date'];
};

export type UrlToken = {
  __typename?: 'UrlToken';
  blockForMinutes: Scalars['Int'];
  token: Scalars['String'];
  validUntil: Scalars['Date'];
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID'];
  cards: Array<Maybe<Card>>;
  createdAt: Scalars['Date'];
  email?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  newsletter?: Maybe<Scalars['Boolean']>;
  transfercode: Scalars['String'];
  updatedAt: Scalars['Date'];
  userRoles: Array<Maybe<Scalars['String']>>;
};

export type UserFragmentFragment = { __typename?: 'User', _id: string, transfercode: string, name?: string | null, email?: string | null, newsletter?: boolean | null, userRoles: Array<string | null>, createdAt: any, updatedAt: any, cards: Array<{ __typename?: 'Card', creationDate: any, honouredAt?: any | null, stamps: Array<{ __typename?: 'Stamp', creationDate: any } | null> } | null> };

export type RefreshTokenFragmentFragment = { __typename?: 'RefreshToken', _id: string, expires: any, created: any, createdByIp: string, createdByUserAgent: string, createdAt: any, updatedAt: any, user: { __typename?: 'User', _id: string } };

export type IpBlockFramentFragment = { __typename?: 'IpBlock', _id: string, ip: string, blockedUntil: any, createdAt: any, updatedAt: any };

export type UrlTokenFragmentFragment = { __typename?: 'UrlToken', token: string, validUntil: any, blockForMinutes: number };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', getUsers: Array<{ __typename?: 'User', _id: string, transfercode: string, name?: string | null, email?: string | null, newsletter?: boolean | null, userRoles: Array<string | null>, createdAt: any, updatedAt: any, cards: Array<{ __typename?: 'Card', creationDate: any, honouredAt?: any | null, stamps: Array<{ __typename?: 'Stamp', creationDate: any } | null> } | null> } | null> };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', getCurrentUser: { __typename?: 'User', _id: string, transfercode: string, name?: string | null, email?: string | null, newsletter?: boolean | null, userRoles: Array<string | null>, createdAt: any, updatedAt: any, cards: Array<{ __typename?: 'Card', creationDate: any, honouredAt?: any | null, stamps: Array<{ __typename?: 'Stamp', creationDate: any } | null> } | null> } };

export type GetActiveRefreshTokensQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActiveRefreshTokensQuery = { __typename?: 'Query', getActiveRefreshTokens: Array<{ __typename?: 'RefreshToken', _id: string, expires: any, created: any, createdByIp: string, createdByUserAgent: string, createdAt: any, updatedAt: any, user: { __typename?: 'User', _id: string } } | null> };

export type GetIpBlocksQueryVariables = Exact<{ [key: string]: never; }>;


export type GetIpBlocksQuery = { __typename?: 'Query', getIpBlocks: Array<{ __typename?: 'IpBlock', _id: string, ip: string, blockedUntil: any, createdAt: any, updatedAt: any } | null> };

export type UpdateUserMutationVariables = Exact<{
  _id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  newsletter: Scalars['Boolean'];
  password?: InputMaybe<Scalars['String']>;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', _id: string, transfercode: string, name?: string | null, email?: string | null, newsletter?: boolean | null, userRoles: Array<string | null>, createdAt: any, updatedAt: any, cards: Array<{ __typename?: 'Card', creationDate: any, honouredAt?: any | null, stamps: Array<{ __typename?: 'Stamp', creationDate: any } | null> } | null> } };

export type SignUpMutationVariables = Exact<{
  name?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  newsletter: Scalars['Boolean'];
  password?: InputMaybe<Scalars['String']>;
  successRedirect: Scalars['String'];
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp: boolean };

export type SignInMutationVariables = Exact<{
  transfercode: Scalars['String'];
  password?: InputMaybe<Scalars['String']>;
  successRedirect: Scalars['String'];
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn: boolean };

export type SignOutMutationVariables = Exact<{ [key: string]: never; }>;


export type SignOutMutation = { __typename?: 'Mutation', signOut: boolean };

export type RefreshMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshMutation = { __typename?: 'Mutation', refresh: boolean };

export type RevokeRefreshTokenMutationVariables = Exact<{
  _id: Scalars['ID'];
}>;


export type RevokeRefreshTokenMutation = { __typename?: 'Mutation', revokeRefreshToken: boolean };

export type DeleteIpBlockMutationVariables = Exact<{
  _id: Scalars['ID'];
}>;


export type DeleteIpBlockMutation = { __typename?: 'Mutation', deleteIpBlock: boolean };

export type AddIpBlockMutationVariables = Exact<{
  ip: Scalars['String'];
  blockedUntil: Scalars['Date'];
}>;


export type AddIpBlockMutation = { __typename?: 'Mutation', addIpBlock: boolean };

export type GenerateUrlTokenMutationVariables = Exact<{
  validUntil: Scalars['Date'];
  blockForMinutes: Scalars['Int'];
}>;


export type GenerateUrlTokenMutation = { __typename?: 'Mutation', generateUrlToken: { __typename?: 'UrlToken', token: string, validUntil: any, blockForMinutes: number } };

export type AddStampMutationVariables = Exact<{
  urlToken: Scalars['String'];
}>;


export type AddStampMutation = { __typename?: 'Mutation', addStamp: boolean };

export type HonourCardFromMutationVariables = Exact<{
  transfercode: Scalars['String'];
}>;


export type HonourCardFromMutation = { __typename?: 'Mutation', honourCardFrom: boolean };

export const UserFragmentFragmentDoc = gql`
    fragment UserFragment on User {
  _id
  transfercode
  name
  email
  newsletter
  cards {
    creationDate
    honouredAt
    stamps {
      creationDate
    }
  }
  userRoles
  createdAt
  updatedAt
}
    `;
export const RefreshTokenFragmentFragmentDoc = gql`
    fragment RefreshTokenFragment on RefreshToken {
  _id
  user {
    _id
  }
  expires
  created
  createdByIp
  createdByUserAgent
  createdAt
  updatedAt
}
    `;
export const IpBlockFramentFragmentDoc = gql`
    fragment IpBlockFrament on IpBlock {
  _id
  ip
  blockedUntil
  createdAt
  updatedAt
}
    `;
export const UrlTokenFragmentFragmentDoc = gql`
    fragment UrlTokenFragment on UrlToken {
  token
  validUntil
  blockForMinutes
}
    `;
export const GetUsersDoc = gql`
    query getUsers {
  getUsers {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;
export const GetCurrentUserDoc = gql`
    query getCurrentUser {
  getCurrentUser {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;
export const GetActiveRefreshTokensDoc = gql`
    query getActiveRefreshTokens {
  getActiveRefreshTokens {
    ...RefreshTokenFragment
  }
}
    ${RefreshTokenFragmentFragmentDoc}`;
export const GetIpBlocksDoc = gql`
    query getIpBlocks {
  getIpBlocks {
    ...IpBlockFrament
  }
}
    ${IpBlockFramentFragmentDoc}`;
export const UpdateUserDoc = gql`
    mutation updateUser($_id: ID!, $name: String, $email: String, $newsletter: Boolean!, $password: String) {
  updateUser(
    _id: $_id
    name: $name
    email: $email
    newsletter: $newsletter
    password: $password
  ) {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;
export const SignUpDoc = gql`
    mutation signUp($name: String, $email: String, $newsletter: Boolean!, $password: String, $successRedirect: String!) {
  signUp(
    name: $name
    email: $email
    newsletter: $newsletter
    password: $password
    successRedirect: $successRedirect
  )
}
    `;
export const SignInDoc = gql`
    mutation signIn($transfercode: String!, $password: String, $successRedirect: String!) {
  signIn(
    transfercode: $transfercode
    password: $password
    successRedirect: $successRedirect
  )
}
    `;
export const SignOutDoc = gql`
    mutation signOut {
  signOut
}
    `;
export const RefreshDoc = gql`
    mutation refresh {
  refresh
}
    `;
export const RevokeRefreshTokenDoc = gql`
    mutation revokeRefreshToken($_id: ID!) {
  revokeRefreshToken(_id: $_id)
}
    `;
export const DeleteIpBlockDoc = gql`
    mutation deleteIpBlock($_id: ID!) {
  deleteIpBlock(_id: $_id)
}
    `;
export const AddIpBlockDoc = gql`
    mutation addIpBlock($ip: String!, $blockedUntil: Date!) {
  addIpBlock(ip: $ip, blockedUntil: $blockedUntil)
}
    `;
export const GenerateUrlTokenDoc = gql`
    mutation generateUrlToken($validUntil: Date!, $blockForMinutes: Int!) {
  generateUrlToken(validUntil: $validUntil, blockForMinutes: $blockForMinutes) {
    ...UrlTokenFragment
  }
}
    ${UrlTokenFragmentFragmentDoc}`;
export const AddStampDoc = gql`
    mutation addStamp($urlToken: String!) {
  addStamp(urlToken: $urlToken)
}
    `;
export const HonourCardFromDoc = gql`
    mutation honourCardFrom($transfercode: String!) {
  honourCardFrom(transfercode: $transfercode)
}
    `;
export const getUsers = (
            options: Omit<
              WatchQueryOptions<GetUsersQueryVariables>, 
              "query"
            >
          ): Readable<
            ApolloQueryResult<GetUsersQuery> & {
              query: ObservableQuery<
                GetUsersQuery,
                GetUsersQueryVariables
              >;
            }
          > => {
            const q = client.watchQuery({
              query: GetUsersDoc,
              ...options,
            });
            var result = readable<
              ApolloQueryResult<GetUsersQuery> & {
                query: ObservableQuery<
                  GetUsersQuery,
                  GetUsersQueryVariables
                >;
              }
            >(
              { data: {} as any, loading: true, error: undefined, networkStatus: 1, query: q },
              (set) => {
                q.subscribe((v: any) => {
                  set({ ...v, query: q });
                });
              }
            );
            return result;
          }
        
              export const AsyncgetUsers = (
                options: Omit<
                  QueryOptions<GetUsersQueryVariables>,
                  "query"
                >
              ) => {
                return client.query<GetUsersQuery>({query: GetUsersDoc, ...options})
              }
            
export const getCurrentUser = (
            options: Omit<
              WatchQueryOptions<GetCurrentUserQueryVariables>, 
              "query"
            >
          ): Readable<
            ApolloQueryResult<GetCurrentUserQuery> & {
              query: ObservableQuery<
                GetCurrentUserQuery,
                GetCurrentUserQueryVariables
              >;
            }
          > => {
            const q = client.watchQuery({
              query: GetCurrentUserDoc,
              ...options,
            });
            var result = readable<
              ApolloQueryResult<GetCurrentUserQuery> & {
                query: ObservableQuery<
                  GetCurrentUserQuery,
                  GetCurrentUserQueryVariables
                >;
              }
            >(
              { data: {} as any, loading: true, error: undefined, networkStatus: 1, query: q },
              (set) => {
                q.subscribe((v: any) => {
                  set({ ...v, query: q });
                });
              }
            );
            return result;
          }
        
              export const AsyncgetCurrentUser = (
                options: Omit<
                  QueryOptions<GetCurrentUserQueryVariables>,
                  "query"
                >
              ) => {
                return client.query<GetCurrentUserQuery>({query: GetCurrentUserDoc, ...options})
              }
            
export const getActiveRefreshTokens = (
            options: Omit<
              WatchQueryOptions<GetActiveRefreshTokensQueryVariables>, 
              "query"
            >
          ): Readable<
            ApolloQueryResult<GetActiveRefreshTokensQuery> & {
              query: ObservableQuery<
                GetActiveRefreshTokensQuery,
                GetActiveRefreshTokensQueryVariables
              >;
            }
          > => {
            const q = client.watchQuery({
              query: GetActiveRefreshTokensDoc,
              ...options,
            });
            var result = readable<
              ApolloQueryResult<GetActiveRefreshTokensQuery> & {
                query: ObservableQuery<
                  GetActiveRefreshTokensQuery,
                  GetActiveRefreshTokensQueryVariables
                >;
              }
            >(
              { data: {} as any, loading: true, error: undefined, networkStatus: 1, query: q },
              (set) => {
                q.subscribe((v: any) => {
                  set({ ...v, query: q });
                });
              }
            );
            return result;
          }
        
              export const AsyncgetActiveRefreshTokens = (
                options: Omit<
                  QueryOptions<GetActiveRefreshTokensQueryVariables>,
                  "query"
                >
              ) => {
                return client.query<GetActiveRefreshTokensQuery>({query: GetActiveRefreshTokensDoc, ...options})
              }
            
export const getIpBlocks = (
            options: Omit<
              WatchQueryOptions<GetIpBlocksQueryVariables>, 
              "query"
            >
          ): Readable<
            ApolloQueryResult<GetIpBlocksQuery> & {
              query: ObservableQuery<
                GetIpBlocksQuery,
                GetIpBlocksQueryVariables
              >;
            }
          > => {
            const q = client.watchQuery({
              query: GetIpBlocksDoc,
              ...options,
            });
            var result = readable<
              ApolloQueryResult<GetIpBlocksQuery> & {
                query: ObservableQuery<
                  GetIpBlocksQuery,
                  GetIpBlocksQueryVariables
                >;
              }
            >(
              { data: {} as any, loading: true, error: undefined, networkStatus: 1, query: q },
              (set) => {
                q.subscribe((v: any) => {
                  set({ ...v, query: q });
                });
              }
            );
            return result;
          }
        
              export const AsyncgetIpBlocks = (
                options: Omit<
                  QueryOptions<GetIpBlocksQueryVariables>,
                  "query"
                >
              ) => {
                return client.query<GetIpBlocksQuery>({query: GetIpBlocksDoc, ...options})
              }
            
export const updateUser = (
            options: Omit<
              MutationOptions<any, UpdateUserMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<UpdateUserMutation, UpdateUserMutationVariables>({
              mutation: UpdateUserDoc,
              ...options,
            });
            return m;
          }
export const signUp = (
            options: Omit<
              MutationOptions<any, SignUpMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<SignUpMutation, SignUpMutationVariables>({
              mutation: SignUpDoc,
              ...options,
            });
            return m;
          }
export const signIn = (
            options: Omit<
              MutationOptions<any, SignInMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<SignInMutation, SignInMutationVariables>({
              mutation: SignInDoc,
              ...options,
            });
            return m;
          }
export const signOut = (
            options: Omit<
              MutationOptions<any, SignOutMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<SignOutMutation, SignOutMutationVariables>({
              mutation: SignOutDoc,
              ...options,
            });
            return m;
          }
export const refresh = (
            options: Omit<
              MutationOptions<any, RefreshMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<RefreshMutation, RefreshMutationVariables>({
              mutation: RefreshDoc,
              ...options,
            });
            return m;
          }
export const revokeRefreshToken = (
            options: Omit<
              MutationOptions<any, RevokeRefreshTokenMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<RevokeRefreshTokenMutation, RevokeRefreshTokenMutationVariables>({
              mutation: RevokeRefreshTokenDoc,
              ...options,
            });
            return m;
          }
export const deleteIpBlock = (
            options: Omit<
              MutationOptions<any, DeleteIpBlockMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<DeleteIpBlockMutation, DeleteIpBlockMutationVariables>({
              mutation: DeleteIpBlockDoc,
              ...options,
            });
            return m;
          }
export const addIpBlock = (
            options: Omit<
              MutationOptions<any, AddIpBlockMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<AddIpBlockMutation, AddIpBlockMutationVariables>({
              mutation: AddIpBlockDoc,
              ...options,
            });
            return m;
          }
export const generateUrlToken = (
            options: Omit<
              MutationOptions<any, GenerateUrlTokenMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<GenerateUrlTokenMutation, GenerateUrlTokenMutationVariables>({
              mutation: GenerateUrlTokenDoc,
              ...options,
            });
            return m;
          }
export const addStamp = (
            options: Omit<
              MutationOptions<any, AddStampMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<AddStampMutation, AddStampMutationVariables>({
              mutation: AddStampDoc,
              ...options,
            });
            return m;
          }
export const honourCardFrom = (
            options: Omit<
              MutationOptions<any, HonourCardFromMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<HonourCardFromMutation, HonourCardFromMutationVariables>({
              mutation: HonourCardFromDoc,
              ...options,
            });
            return m;
          }