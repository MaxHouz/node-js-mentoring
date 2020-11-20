import { pgSequelize } from '../postgres';
import config from 'config';

export default async function () {
    const env = config.get('ENVIRONMENT');
    if (env === 'integration-test') {
        await pgSequelize.authenticate();
        console.log('DB connection for tests has been established successfully.')
    }
}
