const client = require('./index');
const bcrypt = require('bcrypt');
const { createRow } = require('./utils');

const createUser = async ({ ...fields }) => {
    return await createRow('users', fields);
};

module.exports = {
    createUser
};