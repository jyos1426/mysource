import {GraphQLString, GraphQLInt, GraphQLList} from 'graphql'

import UserType from '../type'
import {getAll, getByEmail} from '../resolvers'

export const users = {
  type: new GraphQLList(UserType),
  resolve: getAll
}

export const user = {
  type: UserType,
  args: {
    email: {type: GraphQLString}
  },
  resolve: getByEmail
}
