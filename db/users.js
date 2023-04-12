const client = require('./index');
const bcrypt = require('bcrypt');
const { createRow, getRowById } = require('./utils');

const createUser = async ({ ...fields }) => {
    return await createRow('users', fields);
};

const getUser = async ({ username, password }) => {
    try {
        const user = getUserByUsername(username);
        if (user && bcrypt.compare(password, user.password)) {
            delete user.password;
            return user;
        };
        return null;
    } catch (error) {
        console.error(error);
    };
};

const getUserById = async (id) => {
    try {
        const { rows: [user] } = await client.query(`
            SELECT *
            FROM users
            WHERE id=${id}
        `);
        return user;
    } catch (error) {
        console.error(error);
    };
};

const getUserByUsername = async (username) => {
    try {
        const { rows: [user] } = await client.query(`
            SELECT *
            FROM users
            WHERE name=${username}
        `);
        delete user.password;
        return user;
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createUser
};