/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';

import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

import messages from './messages';
import metadata from './metadata';
import users from './users';

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize.Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize.Sequelize(config.database, config.username, config.password, config);
}

const db: any = {
  messages: messages(sequelize, Sequelize.DataTypes),
  metadata: metadata(sequelize, Sequelize.DataTypes),
  users: users(sequelize, Sequelize.DataTypes)
};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
