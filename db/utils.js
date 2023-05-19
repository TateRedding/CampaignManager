const client = require('./client');

const createRow = async (table, fields) => {
    const keys = Object.keys(fields);
    const valuesString = keys.map((key, index) => `$${index + 1}`).join(', ');
    const columnNames = keys.map((key) => `"${key}"`).join(', ');
    try {
        const { rows: [result] } = await client.query(`
                INSERT INTO ${table}(${columnNames})
                VALUES (${valuesString})
                RETURNING *;
            `, Object.values(fields));
        return result;
    } catch (error) {
        console.error(error);
    };
};

const updateRow = async (table, id, fields) => {
    const setString = Object.keys(fields).map((key, index) => `"${key}"=$${index + 1}`).join(', ');
    if (!setString.length) {
        return;
    };
    try {
        const { rows: [row] } = await client.query(`
            UPDATE ${table}
            SET ${setString}
            WHERE id=${id}
            RETURNING *;
        `, Object.values(fields));
        return row;
    } catch (error) {
        console.error(error);
    };
};

const getRowById = async (table, id) => {
    try {
        const { rows: [row] } = await client.query(`
            SELECT *
            FROM ${table}
            WHERE id=${id}
        `);
        return row;
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createRow,
    updateRow,
    getRowById
};