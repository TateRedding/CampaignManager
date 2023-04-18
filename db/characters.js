const client = require('./index');
const { createRow } = require('./utils');

const createCharacter = async ({ ...fields }) => {
    return await createRow('characters', fields);
};

const updateCharacter = async (id, { ...fields }) => {
    return await updateRow('characters', id, fields);
};

const getCharacterById = async (id) => {
    try {
        const { rows: [character] } = await client.query(`
            SELECT *
            FROM characters
            WHERE id=${id};
        `);
        return character;
    } catch (error) {
        console.error(error);
    };
};

const getAllPublicCharacters = async () => {
    try {
        const { rows: characters } = await client.query(`
            SELECT *
            FROM characters
            WHERE public=true;
        `);
        return characters;
    } catch (error) {
        console.error(error);
    };
};

const getCharactersByUser = async (user) => {
    try {
        const { rows: characters } = await client.query(`
            SELECT *
            FROM characters
            WHERE "userId"=${user.id}
        `);
        return characters;
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createCharacter,
    updateCharacter,
    getCharacterById,
    getAllPublicCharacters,
    getCharactersByUser
};