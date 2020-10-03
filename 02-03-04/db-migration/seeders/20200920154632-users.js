'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('users', [
            {
                id: 'b8cce3e0-b6f2-4683-a6c1-9a3928de8658',
                login: 'user1',
                age: 14,
                password: 'Test1234'
            },
            {
                id: '9a75236f-5d7c-492d-bdb1-2a0d4e870ce4',
                login: 'Auser',
                age: 82,
                password: 'Test1234'
            },
            {
                id: '0f7a5707-9249-4f16-9a1b-3664a272bda1',
                login: 'Buser',
                age: 139,
                password: 'Test1234'
            },
            {
                id: '8c963dbc-21c2-4b59-964d-5ecd6a931e17',
                login: 'Cuser1',
                age: 14,
                password: 'Test1234'
            },
            {
                id: 'a3b2447b-d231-4837-8935-08e8796a9245',
                login: 'Buser2',
                age: 14,
                password: 'Test1234'
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('users', null);
    }
};
