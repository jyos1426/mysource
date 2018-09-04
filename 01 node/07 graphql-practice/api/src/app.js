import express from 'express'

import loadModules from './settings/modules'
import setupGraphQL from './settings/graphql'
import startServer from './settings/server'

const server = express();

loadModules(server);
setupGraphQL(server);
startServer(server);