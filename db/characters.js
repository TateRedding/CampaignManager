const client = require('./client');
const { getRowById, flattenJSON } = require('./utils');

const createCharacter = async (fields) => {
    fields = flattenJSON(fields);
    const keys = Object.keys(fields);
    const valuesString = keys.map((_, index) => `$${index + 1}`).join(', ');
    const columnNames = keys.map(key => {
        return key.split('.').map(key => {
            const arr = key.split('[');
            arr[0] = `"${arr[0]}"`;
            return arr.join('[');
        }).join('.');
    }).join(', ');
    try {
        const { rows: [character] } = await client.query(`
            INSERT INTO characters(${columnNames})
            VALUES (${valuesString})
            RETURNING *;
        `, Object.values(fields));
        return character;
    } catch (error) {
        console.error(error);
    };
};

const updateCharacter = async (id, fields) => {
    fields = flattenJSON(fields);
    const setString = Object.keys(fields).map((key, index) => {
        return `${key.split('.').map(key => {
            const arr = key.split('[');
            arr[0] = `"${arr[0]}"`;
            return arr.join('[');
        }).join('.')}=$${index + 1}`;
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
        return  character;
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