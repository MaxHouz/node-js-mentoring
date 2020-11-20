import { Sequelize } from 'sequelize';
import config from 'config';

const dbName = config.get<string>('DB_NAME');
const dbUser: string = config.get<string>('DB_USER');
const dbPassword = config.get<string>('DB_PASSWORD');
const logging = config.get<boolean>('ENABLE_LOGS');
const port = config.get<number>('DB_PORT');
const host = config.get<string>('DB_HOST');
const dialect = 'postgres';

export const pgSequelize = new Sequelize(dbName, dbUser, dbPassword, {
    dialect,
    port,
    host,
    logging
});
