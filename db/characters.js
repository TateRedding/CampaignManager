const client = require('./index');
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

module.exports = {
    createCharacter
};