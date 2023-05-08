const client = require('./index');
const { createRow, updateRow, getRowById } = require('./utils');

const createCharacter = async ({ ...fields }) => {
    try {
        return await createRow('characters', fields);
    } catch (error) {
        console.error(error);
    };
};

const updateCharacter = async (id, { ...fields }) => {
    try {
        return await updateRow('characters', id, fields);
    } catch (error) {
        console.error(error);
    };
};

const getCharacterById = async (id) => {
    try {
        return await getRowById('characters', id);
    } catch (error) {
        console.error(error);
    };
};

const getAllPublicCharacters = async () => {
    try {
        const { rows: characters } = await client.query(`
            SELECT *
            FROM characters
            WHERE "isPublic"=true;
        `);
        return characters;
    } catch (error) {
        console.error(error);
    };
};

const getCharactersByUserId = async (userId) => {
    try {
        const { rows: characters } = await client.query(`
            SELECT *
            FROM characters
            WHERE "userId"=${userId}
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
    getCharactersByUserId
};