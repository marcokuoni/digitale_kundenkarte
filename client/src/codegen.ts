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
  stamps: Array<Maybe<Stamp>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  refresh: Scalars['Boolean'];
  signIn: Scalars['Boolean'];
  signOut: Scalars['Boolean'];
  signUp: Scalars['Boolean'];
  updateUser: User;
};


export type MutationSignInArgs = {
  password?: InputMaybe<Scalars['String']>;
  transfercode: Scalars['String'];
};


export type MutationSignUpArgs = {
  email?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  newsletter: Scalars['Boolean'];
  password?: InputMaybe<Scalars['String']>;
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
  getCurrentUser: User;
  getUsers: Array<User>;
};

export type Stamp = {
  __typename?: 'Stamp';
  creationDate: Scalars['Date'];
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
};

export type UserFragmentFragment = { __typename?: 'User', _id: string, transfercode: string, name?: string | null, email?: string | null, newsletter?: boolean | null, createdAt: any, updatedAt: any, cards: Array<{ __typename?: 'Card', creationDate: any, stamps: Array<{ __typename?: 'Stamp', creationDate: any } | null> } | null> };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', getUsers: Array<{ __typename?: 'User', _id: string, transfercode: string, name?: string | null, email?: string | null, newsletter?: boolean | null, createdAt: any, updatedAt: any, cards: Array<{ __typename?: 'Card', creationDate: any, stamps: Array<{ __typename?: 'Stamp', creationDate: any } | null> } | null> }> };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', getCurrentUser: { __typename?: 'User', _id: string, transfercode: string, name?: string | null, email?: string | null, newsletter?: boolean | null, createdAt: any, updatedAt: any, cards: Array<{ __typename?: 'Card', creationDate: any, stamps: Array<{ __typename?: 'Stamp', creationDate: any } | null> } | null> } };

export type UpdateUserMutationVariables = Exact<{
  _id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  newsletter: Scalars['Boolean'];
  password?: InputMaybe<Scalars['String']>;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', _id: string, transfercode: string, name?: string | null, email?: string | null, newsletter?: boolean | null, createdAt: any, updatedAt: any, cards: Array<{ __typename?: 'Card', creationDate: any, stamps: Array<{ __typename?: 'Stamp', creationDate: any } | null> } | null> } };

export type SignUpMutationVariables = Exact<{
  name?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  newsletter: Scalars['Boolean'];
  password?: InputMaybe<Scalars['String']>;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp: boolean };

export type SignInMutationVariables = Exact<{
  transfercode: Scalars['String'];
  password?: InputMaybe<Scalars['String']>;
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn: boolean };

export type SignOutMutationVariables = Exact<{ [key: string]: never; }>;


export type SignOutMutation = { __typename?: 'Mutation', signOut: boolean };

export type RefreshMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshMutation = { __typename?: 'Mutation', refresh: boolean };

export const UserFragmentFragmentDoc = gql`
    fragment UserFragment on User {
  _id
  transfercode
  name
  email
  newsletter
  cards {
    creationDate
    stamps {
      creationDate
    }
  }
  createdAt
  updatedAt
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
    mutation signUp($name: String, $email: String, $newsletter: Boolean!, $password: String) {
  signUp(name: $name, email: $email, newsletter: $newsletter, password: $password)
}
    `;
export const SignInDoc = gql`
    mutation signIn($transfercode: String!, $password: String) {
  signIn(transfercode: $transfercode, password: $password)
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