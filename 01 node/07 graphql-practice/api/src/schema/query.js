import {GraphQLObjectType} from 'graphql'
import * as thought from './thoughts/fields/query'
import * as user from './users/fields/query'

const query = new GraphQLObjectType({
  name: 'query',
  description: '...',

  fields: () => ({
    ...thought,
    ...user
  })
})

export default query