import { Sequelize } from 'sequelize'

import env from '../config/env'
import database from '../config/database.json'

const db = database[env]

const connection = new Sequelize(db.database, db.username, db.password, db)

connection
  .authenticate()
  .then(() => {
    console.info('INFO - Database connected.')
  })
  .catch(err => {
    console.error('ERROR - Unable to connect to the database:', err)
  })

export default connection