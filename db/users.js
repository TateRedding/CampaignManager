const client = require('./index');
const bcrypt = require('bcrypt');
const { createRow, updateRow, getRowById } = require('./utils');

const createUser = async ({ ...fields }) => {
    try {
        fields.password = await bcrypt.hash(fields.password, 10);
        const user = await createRow('users', fields);
        delete user.password;
        return user;
    } catch (error) {
        console.error(error);
    };
};

const updateUser = async (id, { ...fields }) => {
    try {
        return await updateRow('users', id, fields);
    } catch (error) {
        console.error(error);
    };
};

const getUser = async (username, password) => {
    try {
        const { rows: [user] } = await client.query(`
            SELECT *
            FROM users
            WHERE username='${username}';
        `);
        if (user && await bcrypt.compare(password, user.password)) {
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
        const user = getRowById('users', id);
        if (user) {
            delete user.password;
            return user;
        };
        return null;
    } catch (error) {
        console.error(error);
    };
};

const getUserByUsername = async (username) => {
    try {
        const { rows: [user] } = await client.query(`
            SELECT *
            FROM users
            WHERE username='${username}';
        `);
        delete user.password;
        return user;
    } catch (error) {
        console.error(error);
    };
};

const getUsersLookingForGroup = async () => {
    try {
        const { rows: users } = await client.query(`
            SELECT *
            FROM users
            WHERE "lookingForGroup"=true;
        `);
        if (users) {
            users.map(user => delete user.password);
            return users;
        };
        return null;
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createUser,
    updateUser,
    getUser,
    getUserById,
    getUserByUsername,
    getUsersLookingForGroup
};