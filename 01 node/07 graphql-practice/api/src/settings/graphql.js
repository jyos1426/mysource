import graphqlHTTP from 'express-graphql'

import config from '../config/config.json'
import schema from '../schema'
// const jwt = require('express-jwt')
// require('dotenv').config()

export default function (server) {
  console.info('SETUP - GraphQL')

  // auth middleware
  // const auth = jwt({
  //   secret: process.env.JWT_SECRET,
  //   credentialsRequired: false
  // })

  server.use('/', graphqlHTTP(() => ({
    schema,
    graphiql: config.graphql.ide,
    pretty: config.graphql.pretty
  })))
}