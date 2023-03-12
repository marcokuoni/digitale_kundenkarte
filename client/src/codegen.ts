import client from "./apollo-client";
import type {
        ApolloQueryResult, ObservableQuery, WatchQueryOptions, MutationOptions
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
  addUser: User;
};


export type MutationAddUserArgs = {
  name: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
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
  updatedAt: Scalars['Date'];
};

export type UserFragmentFragment = { __typename?: 'User', _id: string, name?: string | null, email?: string | null, newsletter?: boolean | null, createdAt: any, updatedAt: any, cards: Array<{ __typename?: 'Card', creationDate: any, stamps: Array<{ __typename?: 'Stamp', creationDate: any } | null> } | null> };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', getUsers: Array<{ __typename?: 'User', _id: string, name?: string | null, email?: string | null, newsletter?: boolean | null, createdAt: any, updatedAt: any, cards: Array<{ __typename?: 'Card', creationDate: any, stamps: Array<{ __typename?: 'Stamp', creationDate: any } | null> } | null> }> };

export type AddUserMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type AddUserMutation = { __typename?: 'Mutation', addUser: { __typename?: 'User', _id: string, name?: string | null, email?: string | null, newsletter?: boolean | null, createdAt: any, updatedAt: any, cards: Array<{ __typename?: 'Card', creationDate: any, stamps: Array<{ __typename?: 'Stamp', creationDate: any } | null> } | null> } };

export const UserFragmentFragmentDoc = gql`
    fragment UserFragment on User {
  _id
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
export const AddUserDoc = gql`
    mutation addUser($name: String!) {
  addUser(name: $name) {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;
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
        
export const addUser = (
            options: Omit<
              MutationOptions<any, AddUserMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<AddUserMutation, AddUserMutationVariables>({
              mutation: AddUserDoc,
              ...options,
            });
            return m;
          }