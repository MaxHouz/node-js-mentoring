import { Client } from 'pg';
const format = require('pg-format');

const users: { [key: string]: any } = {
    'b8cce3e0-b6f2-4683-a6c1-9a3928de8658': {
        id: 'b8cce3e0-b6f2-4683-a6c1-9a3928de8658',
        login: 'user1',
        age: 14,
        password: 'Test1234'
    },
    '0da3f63b-d754-40b8-b70f-299372cbbb22': {
        id: '0da3f63b-d754-40b8-b70f-299372cbbb22',
        login: 'user2',
        age: 23,
        password: 'Test1234'
    },
    '9a75236f-5d7c-492d-bdb1-2a0d4e870ce4': {
        id: '9a75236f-5d7c-492d-bdb1-2a0d4e870ce4',
        login: 'Auser',
        age: 82,
        password: 'Test1234'
    },
    '0f7a5707-9249-4f16-9a1b-3664a272bda1': {
        id: '0f7a5707-9249-4f16-9a1b-3664a272bda1',
        login: 'Buser',
        age: 139,
        password: 'Test1234'
    },
    '8c963dbc-21c2-4b59-964d-5ecd6a931e17': {
        id: '8c963dbc-21c2-4b59-964d-5ecd6a931e17',
        login: 'Cuser1',
        age: 14,
        password: 'Test1234'
    },
    'a3b2447b-d231-4837-8935-08e8796a9245': {
        id: 'a3b2447b-d231-4837-8935-08e8796a9245',
        login: 'Buser2',
        age: 14,
        password: 'Test1234'
    }
};
const userValues = Object.keys(users).map(uuid => {
    const { id, login, age, password } = users[uuid];
    return [id, login, age, password]
});
const insertUsers = format('INSERT INTO Users (id, login, age, password) VALUES %L', userValues);

const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '1111',
    database: 'node-mentoring',
});

client.connect()
    .then(async () => {
        console.log('Connected to node-mentoring DB');
        try {
            await client.query('CREATE TABLE Users (id UUID, login VARCHAR(255), age INT, password VARCHAR(255), "isDeleted" BOOLEAN)');
            console.log('Users table created');
        } catch (e) {
            // 42P07 - error code for already existing table
            if (e.code === '42P07') {
                return;
            } else {
                throw e;
            }
        }
    })
    .then(async () => {
        try {
            await client.query(insertUsers);
            console.log('Table users was successfully populated');
        } catch(e) {
            throw e;
        }
    })
    .catch(console.log)
    .finally(() => client.end());
