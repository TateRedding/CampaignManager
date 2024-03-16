const Ajv = require("ajv");
const ajv = new Ajv();

const abilityStatSchema = {
    "type": "object",
    "properties": {
        "score": { "type": "integer" },
        "mod": { "type": "integer" },
        "save": { "type": "integer" },
        "proficiency": { "type": "boolean" }
    },
    "required": ["score", "mod", "save", "proficiency"]
};

const abilitiesSchema = {
    "type": "object",
    "properties": {
        "strength": abilityStatSchema,
        "dexterity": abilityStatSchema,
        "constitution": abilityStatSchema,
        "intelligence": abilityStatSchema,
        "wisdom": abilityStatSchema,
        "charisma": abilityStatSchema
    },
    "required": ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"]
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
    },
    "required": ["mod", "proficiency"]
};

const skillsSchema = {
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
    },
    "required": ["acrobatics", "animalHandling", "arcana", "athletics", "deception", "history", "insight", "intimidation", "investigation", "medicine", "nature", "perception", "performance", "persuasion", "religion", "sleightOfHand", "stealth", "survival"]
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

const validateCharacterData = (character) => {
    const keys = Object.keys(character);
    for (let i = 0; i < keys.length; i++) {
        const value = character[keys[i]];
        let schema;
        switch (keys[i]) {
            case "abilities":
                schema = abilitiesSchema;
                break;
            case "attacks":
                schema = attackSchema;
                break;
            case "class":
                schema = classSchema;
                break;
            case "hitDice":
                schema = hitDiceSchema;
                break;
            case "skills":
                schema = skillsSchema;
                break;
            case "spells":
                schema = spellSchema;
                break;
            default:
                continue;
        };
        if (schema) {
            const validate = ajv.compile(schema);
            if (Array.isArray(value)) {
                for (let j = 0; j < value.length; j++) {
                    const valid = validate(value[j]);
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
}