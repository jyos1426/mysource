import {GraphQLString, GraphQLInt} from 'graphql'
import GraphQLJSON from 'graphql-type-json';

import UserType from '../type'
import {create, remove, signin, signup} from '../resolvers'

export const userCreate = {
  type: UserType,
  args: {
    id: {
      name: 'id',
      type: GraphQLString
    },
    email: {
      name: 'email',
      type: GraphQLString
    },

    password: {
      name: 'password',
      type: GraphQLString
    }
  },
  resolve: create
}

export const userRemove = {
  type: UserType,
  args: {
    email: {
      name: 'email',
      type: GraphQLInt
    }
  },
  resolve: remove
}

export const userSignin = {
  type: GraphQLString ,
  args: {
    email: {
      name: 'email',
      type: GraphQLString
    },
    password: {
      name: 'password',
      type: GraphQLString
    }
  },
  resolve: signin
}

export const userSignup = {
  type: GraphQLString ,
  args: {
    email: {
      name: 'email',
      type: GraphQLString
    },
    password: {
      name: 'password',
      type: GraphQLString
    }
  },
  resolve: signup
}