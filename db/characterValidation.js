const Ajv = require("ajv");

const abilityStatSchema = {
    "type": "object",
    "properties": {
        "score": { "type": "integer" },
        "mod": { "type": "integer" },
        "save": { "type": "integer" },
        "proficiency": { "type": "boolean" }
    }
};

const abilityStatSchemaWithReqs = {
    "type": "object",
    "properties": {
        "score": { "type": "integer" },
        "mod": { "type": "integer" },
        "save": { "type": "integer" },
        "proficiency": { "type": "boolean" }
    },
    "required": ["score", "mod", "save", "proficiency"]
};

const newAbilitiesSchema = {
    "type": "object",
    "properties": {
        "strength": abilityStatSchemaWithReqs,
        "dexterity": abilityStatSchemaWithReqs,
        "constitution": abilityStatSchemaWithReqs,
        "intelligence": abilityStatSchemaWithReqs,
        "wisdom": abilityStatSchemaWithReqs,
        "charisma": abilityStatSchemaWithReqs
    },
    "required": ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"]
};

const updateAbilitiesSchema = {
    "type": "object",
    "properties": {
        "strength": abilityStatSchema,
        "dexterity": abilityStatSchema,
        "constitution": abilityStatSchema,
        "intelligence": abilityStatSchema,
        "wisdom": abilityStatSchema,
        "charisma": abilityStatSchema
    },
};

const attackSchema = {
    "type": "object",
    "properties": {
        "name": { "type": "string" },
        "attackBonus": { "type": "integer" },
        "damageDie": { "type": "integer" },
        "damageDieCount": { "type": "integer" },
        "damageBonus": { "type": "integer" },
        "damageType": { "type": "string" },
        "save": { "type": "boolean" },
        "saveAbility": { "type": "string" }
    },
    "required": ["name", "damageDie", "damageDieCount", "damageBonus", "damageType", "save"],
};

const classSchema = {
    "type": "object",
    "properties": {
        "baseClass": { "type": "string" },
        "subclass": { "type": "string" },
        "level": { "type": "integer" }
    },
    "required": ["baseClass", "level"]
};

const hitDiceSchema = {
    "type": "object",
    "properties": {
        "dieType": { "type": "integer" },
        "total": { "type": "integer" },
        "remaining": { "type": "integer" }
    },
    "required": ["dieType", "total", "remaining"]
};

const skillStatsSchema = {
    "type": "object",
    "properties": {
        "mod": { "type": "integer" },
        "proficiency": { "type": "boolean" }
    }
};

const skillStatsSchemaWithReqs = {
    "type": "object",
    "properties": {
        "mod": { "type": "integer" },
        "proficiency": { "type": "boolean" }
    },
    "required": ["mod", "proficiency"]
};

const newSkillsSchema = {
    "type": "object",
    "properties": {
        "acrobatics": skillStatsSchemaWithReqs,
        "animalHandling": skillStatsSchemaWithReqs,
        "arcana": skillStatsSchemaWithReqs,
        "athletics": skillStatsSchemaWithReqs,
        "deception": skillStatsSchemaWithReqs,
        "history": skillStatsSchemaWithReqs,
        "insight": skillStatsSchemaWithReqs,
        "intimidation": skillStatsSchemaWithReqs,
        "investigation": skillStatsSchemaWithReqs,
        "medicine": skillStatsSchemaWithReqs,
        "nature": skillStatsSchemaWithReqs,
        "perception": skillStatsSchemaWithReqs,
        "performance": skillStatsSchemaWithReqs,
        "persuasion": skillStatsSchemaWithReqs,
        "religion": skillStatsSchemaWithReqs,
        "sleightOfHand": skillStatsSchemaWithReqs,
        "stealth": skillStatsSchemaWithReqs,
        "survival": skillStatsSchemaWithReqs
    },
    "required": ["acrobatics", "animalHandling", "arcana", "athletics", "deception", "history", "insight", "intimidation", "investigation", "medicine", "nature", "perception", "performance", "persuasion", "religion", "sleightOfHand", "stealth", "survival"]
};

const updateSkillsSchema = {
    "type": "object",
    "properties": {
        "acrobatics": skillStatsSchema,
        "animalHandling": skillStatsSchema,
        "arcana": skillStatsSchema,
        "athletics": skillStatsSchema,
        "deception": skillStatsSchema,
        "history": skillStatsSchema,
        "insight": skillStatsSchema,
        "intimidation": skillStatsSchema,
        "investigation": skillStatsSchema,
        "medicine": skillStatsSchema,
        "nature": skillStatsSchema,
        "perception": skillStatsSchema,
        "performance": skillStatsSchema,
        "persuasion": skillStatsSchema,
        "religion": skillStatsSchema,
        "sleightOfHand": skillStatsSchema,
        "stealth": skillStatsSchema,
        "survival": skillStatsSchema
    }
};

const spellSchema = {
    "type": "object",
    "properties": {
        "name": { "type": "string" },
        "level": { "type": "integer" },
        "school": { "type": "string" },
        "castingTime": { "type": "string" },
        "range": { "type": "string" },
        "verbal": { "type": "boolean" },
        "somatic": { "type": "boolean" },
        "material": { "type": "boolean" },
        "components": { "type": "string" },
        "concentration": { "type": "boolean" },
        "duration": { "type": "string" },
        "description": { "type": "string" },
    },
    "required": ["name", "level", "school", "verbal", "somatic", "material", "concentration"]
};

const validateCharacterData = (entryType, character) => {
    const ajv = new Ajv();
    const schemaMap = {
        "attacks": attackSchema,
        "class": classSchema,
        "hitDice": hitDiceSchema,
        "spells": spellSchema,
    };
    if (entryType === "new") {
        schemaMap["abilities"] = newAbilitiesSchema;
        schemaMap["skills"] = newSkillsSchema;
    } else if (entryType === "update") {
        schemaMap["abilities"] = updateAbilitiesSchema;
        schemaMap["skills"] = updateSkillsSchema;
    } else {
        throw new Error("Validation entry type bust be 'new' or 'update");
    };
    const keys = Object.keys(character);
    for (let i = 0; i < keys.length; i++) {
        const value = character[keys[i]];
        let schema;
        for (let key of Object.keys(schemaMap)) {
            if (keys[i].includes(key)) {
                schema = schemaMap[key];
                break;
            };
        };
        if (schema) {
            if (entryType === "update" && schema["required"]) {
                delete schema["required"];
            };
            const validate = ajv.compile(schema);
            if (entryType === "update" && (keys[i].includes("attacks") || keys[i].includes("class") || keys[i].includes("hitDice") || keys[i].includes("spells"))) {
                const indicies = Object.keys(value);
                for (let j = 0; j < indicies.length; j++) {
                    const valid = validate(value[indicies[j]]);
                    if (!valid) throw new Error(`SchemaPath: ${validate.errors[0].schemaPath} - ${validate.errors[0].message}`);
                };
            } else if (Array.isArray(value)) {
                for (let k = 0; k < value.length; k++) {
                    const valid = validate(value[k]);
                    if (!valid) throw new Error(`SchemaPath: ${validate.errors[0].schemaPath} - ${validate.errors[0].message}`);
                };
            } else {
                const valid = validate(value);
                if (!valid) throw new Error(`SchemaPath: ${validate.errors[0].schemaPath} - ${validate.errors[0].message}`);
            };
        };
    };
    return true;
};

module.exports = {
    validateCharacterData
};