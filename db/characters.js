const client = require('./client');
const { createRow, getRowById, formatCharacterDataForDBEntry, updateRow } = require('./utils');

const createCharacter = async (fields) => {
    fields = formatCharacterDataForDBEntry(fields);
    try {
        return await createRow('characters', fields);
    } catch (error) {
        console.error(error);
    };
};

// This function does not account for nested arrays. If nested arrays are ever introduced, this function will need to be updated.
const updateCharacter = async (id, fields) => {
    fields = formatCharacterDataForDBEntry(fields);
    const setString = Object.keys(fields).map((key, index) => {
        if (key.includes('[')) {
            const split = key.split('[');
            return `"${split[0]}"[${split[1]}=$${index + 1}`;
        } else {
            return `"${key}"=$${index + 1}`;
        };
    }).join(', ');
    if (!setString.length) {
        return;
    };
    try {
        const { rows: [character] } = await client.query(`
            UPDATE characters
            SET ${setString}
            WHERE id=${id}
            RETURNING *;
        `, Object.values(fields));
        return character;
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

const getAllCharacters = async () => {
    try {
        const { rows: characters } = await client.query(`
            SELECT *
            FROM characters;
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
            WHERE "userId"=${userId};
        `);
        return characters;
    } catch (error) {
        console.error(error);
    };
};

const deleteCharacter = async (id) => {
    try {
        const character = await getCharacterById(id);
        if (character) {
            const { rows: [deletedCharacter] } = await client.query(`
            DELETE FROM characters
            WHERE id=${id}
            RETURNING *;
        `);
            return deletedCharacter;
        }
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createCharacter,
    updateCharacter,
    getCharacterById,
    getAllCharacters,
    getCharactersByUserId,
    deleteCharacter
};