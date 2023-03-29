const client = require('./index');
const bcrypt = require('bcrypt');

const createUser = async ({ ...fields }) => {
    const valuesString = Object.keys(fields).map((key, index) => `$${index + 1}`).join(', ');
    const columnNames = Object.keys(fields).map((key) => `"${key}"`).join(', ');
    try {
        fields.password = await bcrypt.hash(fields.password, 10);
        const { rows: [user] } = await client.query(`
            INSERT INTO users(${columnNames})
            VALUES (${valuesString})
            ON CONFLICT (username) DO NOTHING
            RETURNING *;
        `, Object.values(fields));
        return user;
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createUser
};