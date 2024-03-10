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

const flattenJSON = (object) => {
    const result = {};
    const recurse = (currValue, currKey) => {
        if (Array.isArray(currValue)) {
            for (let i = 0; i < currValue.length; i++) {
                recurse(currValue[i], currKey ? `${currKey}[${i}]` : `[${i}]`);
            };
            if (!currValue.length) result[currKey] = [];
        } else if (typeof currValue === "object") {
            let isEmpty = false;
            for (const key in currValue) {
                isEmpty = false;
                recurse(currValue[key], currKey ? `${currKey}.${key}` : key)
            };
        } else {
            result[currKey] = currValue;
        };
    };
    recurse(object, "");
    return result;
};
/*
const parseCharacterData = (character) => {
    let characterString = "";
    const baseKeys = Object.keys(character)
    for (let i = 0; i < baseKeys.length; i++) {
        let currValue = character[baseKeys[i]];
        if (typeof currValue === "string") {
            currValue = `"${currValue}"`
        };
        // Needs to parse return strings and add appropriate keys.
        // For attacks and spells, if currValue is null, it would basiclaly just follow the same as the default
        switch (baseKeys[i]) {
            case "abilities":
                console.log("Abilities: " + currValue);
                break;
            case "attacks":
                console.log("Attacks: " + currValue);
                break;
            case "class":
                console.log("Class: " + currValue);
                break;
            case "hitDice":
                console.log("Hit Dice: " + currValue);
                break;
            case "skills":
                console.log("Skills: " + currValue);
                break;
            case "spells":
                console.log("Spells: " + currValue);
                break;
            default:
                characterString ? characterString += `, "${baseKeys[i]}": ${currValue}` : characterString += `"${baseKeys[i]}": ${currValue}`;
                break;
        };
    };
    return character
};
*/

module.exports = {
    createRow,
    updateRow,
    getRowById,
    flattenJSON,
    //parseCharacterData
};