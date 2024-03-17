const client = require('./client');
const { createRow, getRowById, formatCharacterDataForDBEntry } = require('./utils');
const { validateCharacterData } = require('./characterValidation');

const createCharacter = async (fields) => {
    try {
        validateCharacterData("new", fields);
        fields = formatCharacterDataForDBEntry(fields);
        return await createRow('characters', fields);
    } catch (error) {
        console.error(error);
    };
};

const updateCharacter = async (id, fields) => {
    try {
        validateCharacterData("update", fields);
        const updates = [];
        const values = [];
        let index = 1;
        Object.entries(fields).forEach(([key, value]) => {
            if (key === "attacks" || key === "class" || key === "hitDice" || key === "spells") {
                for (const [subKey, subValue] of Object.entries(value)) {
                    updates.push(`"${key}"[${subKey}] = $${index++}`);
                    values.push(subValue);
                };
            } else {
                updates.push(`"${key}" = $${index++}`);
                values.push(value);
            };
        });
        const { rows: [character] } = await client.query(`
            UPDATE characters
            SET ${updates.join(', ')}
            WHERE id = ${id}
            RETURNING *;
        `, values);
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