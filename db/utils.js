const client = require('./client');

const createRow = async (table, fields) => {
    const keys = Object.keys(fields);
    const valuesString = keys.map((_, index) => `$${index + 1}`).join(', ');
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

// This function does not account for nested arrays. If nested arrays are ever introduced, this function will need to be updated.
const formatCharacterDataForDBEntry = (character) => {
    const baseKeys = Object.keys(character);
    for (let i = 0; i < baseKeys.length; i++) {
        let currValue = character[baseKeys[i]];
        if (Array.isArray(currValue)) {
            character[baseKeys[i]] = character[baseKeys[i]].map(subVal => JSON.stringify(subVal));
        } else if (typeof currValue === "object") {
            character[baseKeys[i]] = JSON.stringify(character[baseKeys[i]]);
        };
    };
    return character;
};

module.exports = {
    createRow,
    updateRow,
    getRowById,
    formatCharacterDataForDBEntry
};