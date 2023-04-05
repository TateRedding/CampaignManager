const client = require('./index');
const { getTrueProficiencies } = require('./utils');
const {
    createSavingThrowProficiencies,
    createSkillProficiencies,
    createArmorProficiencies,
    createWeaponProficiencies,
    createLanguageProficiencies,
    createToolProficiencies,
    createVehicleProficiencies } = require('./proficiencies');

const createCharacter = async (
    { ...characterFields },
    { ...savingThrowProficiencyFields },
    { ...skillProficiencyFields },
    { ...armorProficiencyFields },
    { ...weaponProficiencyFields },
    { ...languageProficiencyFields },
    { ...toolProficiencyFields },
    { ...vehicleProficiencyFields }) => {
    const valuesString = Object.keys(characterFields).map((key, index) => `$${index + 1}`).join(', ');
    const columnNames = Object.keys(characterFields).map((key) => `"${key}"`).join(', ');
    try {
        const { rows: [_character] } = await client.query(`
            INSERT INTO characters(${columnNames})
            VALUES (${valuesString})
            RETURNING *;
        `, Object.values(characterFields));

        const savingThrowProficiencies = await createSavingThrowProficiencies({ ...savingThrowProficiencyFields });
        const skillProficiencies = await createSkillProficiencies({ ...skillProficiencyFields });
        const armorProficiencies = await createArmorProficiencies({ ...armorProficiencyFields });
        const weaponProficiencies = await createWeaponProficiencies({ ...weaponProficiencyFields });
        const languageProficiencies = await createLanguageProficiencies({ ...languageProficiencyFields });
        const toolProficiencies = await createToolProficiencies({ ...toolProficiencyFields });
        const vehicleProficiencies = await createVehicleProficiencies({ ...vehicleProficiencyFields });

        const { rows: [character] } = await client.query(`
            UPDATE characters
            SET "savingThrowProficiencies"=${savingThrowProficiencies.id},
                "skillProficiencies"=${skillProficiencies.id},
                "armorProficiencies"=${armorProficiencies.id},
                "weaponProficiencies"=${weaponProficiencies.id},
                "languageProficiencies"=${languageProficiencies.id},
                "toolProficiencies"=${toolProficiencies.id},
                "vehicleProficiencies"=${vehicleProficiencies.id}
            WHERE id=${_character.id}
            RETURNING *;
        `);
        return character;
    } catch (error) {
        console.error(error);
    };
};

const getCharacterById = async (id) => {
    try {
        const { rows: [character] } = await client.query(`
            SELECT *
            FROM characters
            WHERE id=${id};
        `)

        const { rows: [savingThrowProficiencies] } = await client.query(`
            SELECT *
            FROM saving_throw_proficiencies
            WHERE id=${character.savingThrowProficiencies};
        `);

        const { rows: [skillProficiencies] } = await client.query(`
            SELECT *
            FROM skill_proficiencies
            WHERE id=${character.skillProficiencies};
        `);

        const { rows: [armorProficiencies] } = await client.query(`
            SELECT *
            FROM armor_proficiencies
            WHERE id=${character.armorProficiencies};
        `);

        const { rows: [weaponProficiencies] } = await client.query(`
            SELECT *
            FROM weapon_proficiencies
            WHERE id=${character.weaponProficiencies};
        `);

        const { rows: [languageProficiencies] } = await client.query(`
            SELECT *
            FROM language_proficiencies
            WHERE id=${character.languageProficiencies};
        `);

        const { rows: [toolProficiencies] } = await client.query(`
            SELECT *
            FROM tool_proficiencies
            WHERE id=${character.toolProficiencies};
        `);

        const { rows: [vehicleProficiencies] } = await client.query(`
            SELECT *
            FROM vehicle_proficiencies
            WHERE id=${character.vehicleProficiencies};
        `);

        character.savingThrowProficiencies = getTrueProficiencies(savingThrowProficiencies);
        character.skillProficiencies = getTrueProficiencies(skillProficiencies);
        character.armorProficiencies = getTrueProficiencies(armorProficiencies);
        character.weaponProficiencies = getTrueProficiencies(weaponProficiencies);
        character.languageProficiencies = getTrueProficiencies(languageProficiencies);
        character.toolProficiencies = getTrueProficiencies(toolProficiencies);
        character.vehicleProficiencies = getTrueProficiencies(vehicleProficiencies);
        
        return character;
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createCharacter,
    getCharacterById
};