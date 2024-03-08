const defaultAbilities = {
    strength: {
        score: 10,
        mod: 0,
        save: 0,
        proficiency: false
    },
    dexterity: {
        score: 10,
        mod: 0,
        save: 0,
        proficiency: false
    },
    constitution: {
        score: 10,
        mod: 0,
        save: 0,
        proficiency: false
    },
    intelligence: {
        score: 10,
        mod: 0,
        save: 0,
        proficiency: false
    },
    wisdom: {
        score: 10,
        mod: 0,
        save: 0,
        proficiency: false
    },
    charisma: {
        score: 10,
        mod: 0,
        save: 0,
        proficiency: false
    }
};

const defaultSkills = {
    acrobatics: {
        mod: 0,
        proficiency: false
    },
    animalHandling: {
        mod: 0,
        proficiency: false
    },
    arcana: {
        mod: 0,
        proficiency: false
    },
    athletics: {
        mod: 0,
        proficiency: false
    },
    deception: {
        mod: 0,
        proficiency: false
    },
    history: {
        mod: 0,
        proficiency: false
    },
    insight: {
        mod: 0,
        proficiency: false
    },
    intimidation: {
        mod: 0,
        proficiency: false
    },
    investigation: {
        mod: 0,
        proficiency: false
    },
    medicine: {
        mod: 0,
        proficiency: false
    },
    nature: {
        mod: 0,
        proficiency: false
    },
    perception: {
        mod: 0,
        proficiency: false
    },
    performance: {
        mod: 0,
        proficiency: false
    },
    persuasion: {
        mod: 0,
        proficiency: false
    },
    religion: {
        mod: 0,
        proficiency: false
    },
    sleightOfHand: {
        mod: 0,
        proficiency: false
    },
    stealth: {
        mod: 0,
        proficiency: false
    },
    survival: {
        mod: 0,
        proficiency: false
    }
};

const treddFargrim = {
    userId: 1,
    name: 'Tredd Fargrim',
    species: 'dwarf',
    subspecies: 'mountain',
    class: [{
        baseClass: 'paladin',
        subclass: null,
        level: 1
    }],
    alignment: 'lawful-good',
    background: 'noble',
    age: 146,
    height: 41,
    weight: 190,
    eyes: 'brown',
    hair: 'reddish brown',
    skin: 'pale',
    abilities: {
        strength: {
            score: 16,
            mod: 3,
            save: 5,
            proficiency: true
        },
        dexterity: {
            score: 9,
            mod: -1,
            save: -1,
            proficiency: false
        },
        constitution: {
            score: 14,
            mod: 2,
            save: 4,
            proficiency: true
        },
        intelligence: {
            score: 10,
            mod: 0,
            save: 0,
            proficiency: false
        },
        wisdom: {
            score: 8,
            mod: -1,
            save: -1,
            proficiency: false
        },
        charisma: {
            score: 13,
            mod: 1,
            save: 1,
            proficiency: false
        }
    },
    skills: {
        acrobatics: {
            mod: -1,
            proficiency: false
        },
        animalHandling: {
            mod: -1,
            proficiency: false
        },
        arcana: {
            mod: 0,
            proficiency: false
        },
        athletics: {
            mod: 3,
            proficiency: false
        },
        deception: {
            mod: 2,
            proficiency: false
        },
        history: {
            mod: 2,
            proficiency: true
        },
        insight: {
            mod: -1,
            proficiency: false
        },
        intimidation: {
            mod: 4,
            proficiency: true
        },
        investigation: {
            mod: 0,
            proficiency: false
        },
        medicine: {
            mod: -1,
            proficiency: false
        },
        nature: {
            mod: 0,
            proficiency: false
        },
        perception: {
            mod: 1,
            proficiency: true
        },
        performance: {
            mod: 2,
            proficiency: false
        },
        persuasion: {
            mod: 2,
            proficiency: false
        },
        religion: {
            mod: 2,
            proficiency: true
        },
        sleightOfHand: {
            mod: -1,
            proficiency: false
        },
        stealth: {
            mod: -1,
            proficiency: false
        },
        survival: {
            mod: 1,
            proficiency: true
        }
    },
    proficiencyBonus: 2,
    passivePerception: 11,
    otherProficiencies: "All armor, Shields, All weapons, Mason's Tools, Land Vehicles, Common, Dwarvish",
    armorClass: 18,
    initiative: -1,
    hitPoints: 12,
    currentHitPoints: 12,
    hitDice: [{
        type: 10,
        total: 1,
        remaining: 1,
    }],
    attacks: [{
        name: 'Greataxe',
        attackBonus: 5,
        damageDie: 12,
        damageDieCount: 1,
        damageBonus: 3,
        damageType: 'slashing',
        save: false,
        saveAbility: null
    }],
    gold: 100,
    equipment: 'Shield, plate armor, greatsword, 10 torches, 50 feet of hempen rope',
    personalityTraits: 'I have a pretty big ego. I am very easy to get along with.',
    ideals: 'Justice must be served',
    bonds: 'I must protect those who cannot protect themselves',
    flaws: 'I cannot turn down a drink',
    featuresAndTraits: 'Stonecunning, Lay on Hands, Divine Sense',
    spellcastingAbility: 'charisma',
    spellSaveDC: 11,
    spellAttackBonus: 4
};

const thyriLittleflower = {
    userId: 2,
    name: 'Thyri Littleflower',
    level: 13,
    experience: 168970,
    species: 'elf',
    class: [{
        baseClass: 'druid',
        subclass: 'circle of the land',
        level: 13
    }],
    alignment: 'chaotic-good',
    background: 'escaped research relic',
    age: 314,
    height: 71,
    weight: 150,
    eyes: 'yellow',
    hair: 'deep mahogany',
    skin: 'silvery',
    abilities: {
        strength: {
            score: 13,
            mod: 1,
            save: 1,
            proficiency: false
        },
        dexterity: {
            score: 13,
            mod: 1,
            save: 1,
            proficiency: false
        },
        constitution: {
            score: 14,
            mod: 2,
            save: 2,
            proficiency: false
        },
        intelligence: {
            score: 13,
            mod: 1,
            save: 6,
            proficiency: true
        },
        wisdom: {
            score: 13,
            mod: 1,
            save: 6,
            proficiency: true
        },
        charisma: {
            score: 14,
            mod: 2,
            save: 2,
            proficiency: false
        }
    },
    skills: {
        acrobatics: {
            mod: 1,
            proficiency: false
        },
        animalHandling: {
            mod: 6,
            proficiency: true
        },
        arcana: {
            mod: 1,
            proficiency: false
        },
        athletics: {
            mod: 1,
            proficiency: false
        },
        deception: {
            mod: 2,
            proficiency: false
        },
        history: {
            mod: 2,
            proficiency: false
        },
        insight: {
            mod: 1,
            proficiency: false
        },
        intimidation: {
            mod: 2,
            proficiency: false
        },
        investigation: {
            mod: 1,
            proficiency: false
        },
        medicine: {
            mod: 1,
            proficiency: false
        },
        nature: {
            mod: 1,
            proficiency: false
        },
        perception: {
            mod: 6,
            proficiency: true
        },
        performance: {
            mod: 2,
            proficiency: false
        },
        persuasion: {
            mod: 2,
            proficiency: false
        },
        religion: {
            mod: 1,
            proficiency: false
        },
        sleightOfHand: {
            mod: 1,
            proficiency: false
        },
        stealth: {
            mod: 1,
            proficiency: false
        },
        survival: {
            mod: 6,
            proficiency: true
        }
    },
    proficiencyBonus: 5,
    passivePerception: 16,
    otherProficiencies: 'Light Armor, Medium Armor, Shields, Clubs, Daggers, Darts, Javelins, Maces, Quarterstaffs, Scimitars, Sickles, Slings, Spears, Common, Celestial, Druidic, Elvish',
    inspiration: true,
    armorClass: 14,
    initiative: 1,
    hitPoints: 96,
    currentHitPoints: 96,
    temporaryHitPoints: 5,
    hitDice: [{
        type: 8,
        total: 13,
        remaining: 13
    }],
    attacks: [{
        name: 'Quarterstaff (One handed)',
        attackBonus: 6,
        damageDie: 6,
        damageDieCount: 1,
        damageBonus: 1,
        damageType: 'bludgeoning',
        save: false,
        saveAbility: null
    }, {
        name: 'Quarterstaff (Two handed)',
        attackBonus: 6,
        damageDie: 8,
        damageDieCount: 1,
        damageBonus: 1,
        damageType: 'bludgeoning',
        save: false,
        saveAbility: null
    }, {
        name: 'Produce Flame',
        attackBonus: 7,
        damageDie: 8,
        damageDieCount: 3,
        damageBonus: 0,
        damageType: 'fire',
        save: false,
        saveAbility: null
    }],
    spells: [{
        name: 'Produce Flame',
        level: 0,
        school: 'conjuration',
        castingTime: '1 action',
        range: 'self',
        verbal: true,
        somatic: true,
        material: false,
        components: null,
        concentration: false,
        duration: '10 minutes',
        description: 'A flickering flame appears in your hand...'
    }],
    copper: 7,
    silver: 1,
    etherium: 1,
    gold: 408,
    platinum: 160,
    equipment: 'Druidic Focus, Waterskin, Quarterstaff, Backpack, Bedroll, Potion of Thunder Resistance, Scroll of Tidal Wave',
    personalityTraits: 'Distracted, gentle unless provoked vision-centric, intuitive',
    ideals: 'To locate healing serum for a mother she lost years ago. To ensure the well being of young living things, distrusts organization or for-profit ideals.',
    bonds: 'Fascination for all living things. A great sense for justice/balance.',
    flaws: 'Extremely distanced from reality when visions/nightmares of old experimentation take hold.',
    featuresAndTraits: "Fey Ancestry, Trance, Natural Recovery, Nature's Ward, Lucky",
    spellcastingAbility: 'charisma',
    spellSaveDC: 15,
    spellAttackBonus: 7
};

module.exports = {
    defaultAbilities,
    defaultSkills,
    treddFargrim,
    thyriLittleflower
};