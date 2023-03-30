const client = require('./index');

const createMessage = async ({ ...fields }) => {
    const valuesString = Object.keys(fields).map((key, index) => `$${index + 1}`).join(', ');
    const columnNames = Object.keys(fields).map((key) => `"${key}"`).join(', ');
    try {
        const { rows: [message] } = await client.query(`
            INSERT INTO messages(${columnNames})
            VALUES (${valuesString})
            RETURNING *;
        `, Object.values(fields));
        return message;
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createMessage
};