const client = require('./index');
const bcrypt = require('bcrypt');

const createUser = async ({ ...fields }) => {
    const valueCount = Object.keys(fields).map((key, index) => `$${index + 1}`).join(', ');
    const columnNames = Object.keys(fields).map((key) => `"${key}"`).join(', ');
    try {
        fields.password = await bcrypt.hash(fields.password, 10);
        const { rows } = await client.query(`
            INSERT INTO users(${columnNames})
            VALUES (${valueCount})
            ON CONFLICT (username) DO NOTHING
            RETURNING *;
        `, Object.values(fields));
        return rows;
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createUser
}