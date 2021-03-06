import Sequelize from 'sequelize'

import sequelize from '../settings/sequelize'
import fs from 'fs';
const path = require('path');
const basename = path.basename(__filename);

// const db = {};
// let sequelize;

const db = {
  Thought : sequelize.import('./thought'),
  User    : sequelize.import('./user')
}
// auto mapping db 
// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
//   })
//   .forEach(file => {
//     const model = sequelize['import'](path.join(__dirname, file));
//     db[model.name] = model;
//   });

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db
