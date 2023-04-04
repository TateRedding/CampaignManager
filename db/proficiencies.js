const client = require('./index');
const { createRow } = require('./utils');

// SAVING THROW PROFICIENCIES

const createSavingThrowProficiencies = async ({ ...fields }) => {
    return await createRow('saving_throw_proficiencies', fields);
};

// SKILL PROFICIENCIES

const createSkillProficiencies = async ({ ...fields }) => {
    return await createRow('skill_proficiencies', fields);
};

// ARMOR PROFICIENCIES

const createArmorProficiencies = async ({ ...fields }) => {
    return await createRow('armor_proficiencies', fields);
};

// WEAPON PROFICIENCIES

const createWeaponProficiencies = async ({ ...fields }) => {
    return await createRow('weapon_proficiencies', fields);
};

// LANGUAGE PROFICIENCIES

const createLanguageProficiencies = async ({ ...fields }) => {
    return await createRow('language_proficiencies', fields);
};

// TOOL PROFICIENCIES

const createToolProficiencies = async ({ ...fields }) => {
    return await createRow('tool_proficiencies', fields);
};

// VEHICLE PROFICIENCIES

const createVehicleProficiencies = async ({ ...fields }) => {
    return await createRow('vehicle_proficiencies', fields);
};

module.exports = {
    createSavingThrowProficiencies,
    createSkillProficiencies,
    createArmorProficiencies,
    createWeaponProficiencies,
    createLanguageProficiencies,
    createToolProficiencies,
    createVehicleProficiencies
};