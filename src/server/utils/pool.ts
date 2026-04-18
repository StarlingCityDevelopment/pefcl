import mysql from 'mysql2';
import { Sequelize } from 'sequelize';
import { CONNECTION_STRING, parseUri } from './dbUtils';

const mysqlConnectionString = GetConvar(CONNECTION_STRING, 'none');

if (mysqlConnectionString === 'none') {
  throw new Error(
    `No connection string provided. make sure "${CONNECTION_STRING}" is set in server.cfg`,
  );
}

const config = parseUri(mysqlConnectionString);

export const sequelize = new Sequelize({
  dialect: 'mysql',
  dialectModule: mysql,
  logging: false,
  host: config.host,
  port: Number(config.port),
  username: config.user,
  password: config.password,
  database: config.database,
  pool: {
    max: 300,
    min: 0,
    acquire: 200_000,
    idle: 60_000,
  },
  sync: {
    alter: true,
    force: true,
  },
});
