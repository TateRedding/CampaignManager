const client = require('./index');
const { createRow, getRowById } = require('./utils');

const createCharacter = async ({ ...fields }) => {
    return await createRow('characters', fields);
};

const getCharacterById = async (id) => {
    try {
        const { rows: [character] } = await client.query(`
            SELECT *
            FROM characters
            WHERE id=${id}
        `);
        return character;
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createCharacter,
    getCharacterById
};