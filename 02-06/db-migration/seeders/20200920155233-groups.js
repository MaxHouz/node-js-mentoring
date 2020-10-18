'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('groups', [
            {
                id: 'bbadc27c-4889-4ead-a079-cefc1d385c47',
                name: 'Readonly',
                permissions: ['READ']
            },
            {
                id: '805d71e6-a245-4d57-b6a4-5cb8e44b01a6',
                name: 'Read/Write',
                permissions: ['READ', 'WRITE']
            },
            {
                id: '452ba6e9-7e55-4fc0-80ae-00b395ded786',
                name: 'Moderators',
                permissions: ['READ', 'WRITE', 'DELETE']
            },
            {
                id: '523dce81-d28b-4058-876b-2bc92ad8366a',
                name: 'Super user',
                permissions: ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES']
            },
            {
                id: 'bf6c1dfb-534d-4552-9911-12497fad8eb5',
                name: 'Test group',
                permissions: ['READ', 'SHARE']
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('groups', null);
    }
};
