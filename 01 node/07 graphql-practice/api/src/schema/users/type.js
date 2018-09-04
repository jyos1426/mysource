import {GraphQLObjectType, GraphQLString, GraphQLInt} from 'graphql'

const UserType = new GraphQLObjectType({
  name: 'user',
  description: '...',

  fields: () => ({
    id: {type: GraphQLInt},
    email: {type: GraphQLString},
    password: {type: GraphQLString},
    createdAt: {type: GraphQLString},
    updatedAt: {type: GraphQLString}
  })
})

export default UserType