import { Sequelize } from 'sequelize';

export const pgSequelize = new Sequelize('postgres://postgres:1111@localhost:5432/node-mentoring');

pgSequelize.authenticate()
    .then(() => console.log('DB connection has been established successfully.'))
    .catch(error => console.error('Unable to connect to the database:', error));
