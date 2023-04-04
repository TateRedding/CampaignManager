const client = require('./index');
const bcrypt = require('bcrypt');
const { createRow } = require('./utils');

const createUser = async ({ ...fields }) => {
    return await createRow('users', fields);
};

const getUserById = async (id) => {
    try {
        const { rows: [user] } = await client.query(`
          SELECT *
          FROM users
          WHERE id=${id};
        `);
        delete user.password;
        return user;
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createUser,
    getUserById
};