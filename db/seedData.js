const client = require('./client');
const { createUser } = require('./users');
const { createCampaign } = require('./campaigns');
const { createUserCampaign } = require('./user_campaigns');
const { createMessage } = require('./messages');
const { createCharacter } = require('./characters');
const { createFakeCharacter } = require("../tests/utils");

const dropTables = async () => {
    try {
        console.log('Dropping tables...');
        await client.query(`
            DROP TABLE IF EXISTS user_campaigns;
            DROP TABLE IF EXISTS messages;
            DROP TABLE IF EXISTS characters;
            DROP TABLE IF EXISTS campaigns;
            DROP TABLE IF EXISTS users;
            DROP TYPE IF EXISTS alignment;
        `);
        console.log('Finished dropping tables.');
    } catch (error) {
        console.log('Error dropping tables!');
        console.error(error);
    };
};

const createTables = async () => {
    try {
        console.log('Creating tables...');
        await client.query(`
            CREATE TYPE alignment AS ENUM (
                'lawful-good',
                'neutral-good',
                'chaotic-good',
                'lawful-neutral',
                'true-neutral',
                'chaotic-neutral',
                'lawful-evil',
                'neutral-evil',
                'chaotic-evil'
            );

            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(100) NOT NULL,
                email VARCHAR(150) NOT NULL,
                "registerDate" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                "isActive" BOOLEAN DEFAULT true,
                "deactivationDate" TIMESTAMPTZ,
                "lookingForGroup" BOOLEAN DEFAULT false,
                "isAdmin" BOOLEAN DEFAULT false,
                "avatarURL" text NOT NULL,
                "firstName" VARCHAR(100),
                surname VARCHAR(100),
                location VARCHAR(100),
                bio TEXT
            );

            CREATE TABLE campaigns (
                id SERIAL PRIMARY KEY,
                "creatorId" INTEGER REFERENCES users(id) NOT NULL,
                "lookingForPlayers" BOOLEAN DEFAULT false,
                name VARCHAR(255) NOT NULL,
                "imageURL" TEXT,
                description TEXT,
                location VARCHAR(255),
                "creationDate" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
 
            CREATE TABLE characters (
                id SERIAL PRIMARY KEY,
                "userId" INTEGER NOT NULL REFERENCES users(id),
                name VARCHAR(100) NOT NULL,
                level INTEGER DEFAULT 1,
                experience INTEGER DEFAULT 0,
                species VARCHAR(50) NOT NULL,
                subspecies VARCHAR(50),
                class VARCHAR(50) NOT NULL,
                subclass VARCHAR(50),
                alignment ALIGNMENT NOT NULL, 
                background VARCHAR(100) NOT NULL,
                age INTEGER,
                height INTEGER,
                weight INTEGER,
                eyes VARCHAR(35),
                hair VARCHAR(35),
                skin VARCHAR(35),
                inspiration BOOLEAN DEFAULT false,
                strength INTEGER DEFAULT 10,
                dexterity INTEGER DEFAULT 10,
                constitution INTEGER DEFAULT 10,
                intelligence INTEGER DEFAULT 10,
                wisdom INTEGER DEFAULT 10,
                charisma INTEGER DEFAULT 10,
                proficiencies JSON NOT NULL,
                "armorClass" INTEGER DEFAULT 10,
                speed INTEGER DEFAULT 25,
                "maxHitPoints" INTEGER DEFAULT 0,
                "currentHitPoints" INTEGER DEFAULT 0,
                "temporaryHitPoints" INTEGER DEFAULT 0,
                "totalHitDice" JSON NOT NULL,
                "currentHitDice" JSON NOT NULL,
                "deathSaveSuccesses" INTEGER DEFAULT 0,
                "deathSaveFailures" INTEGER DEFAULT 0,
                attacks JSON,
                spells JSON,
                copper INTEGER DEFAULT 0,
                silver INTEGER DEFAULT 0,
                etherium INTEGER DEFAULT 0,
                gold INTEGER DEFAULT 0,
                platinum INTEGER DEFAULT 0,
                equipment TEXT,
                "personalityTraits" TEXT,
                ideals TEXT,
                bonds TEXT,
                flaws TEXT,
                features JSON NOT NULL
            );

            CREATE TABLE user_campaigns (
                id SERIAL PRIMARY KEY,
                "userId" INTEGER NOT NULL REFERENCES users(id),
                "campaignId" INTEGER NOT NULL REFERENCES campaigns(id),
                "isDM" BOOLEAN DEFAULT FALSE,
                "characterId" INTEGER REFERENCES characters(id),
                UNIQUE ("userId", "campaignId")
            );

            CREATE TABLE messages (
                id SERIAL PRIMARY KEY,
                "senderId" INTEGER NOT NULL REFERENCES users(id),
                "recipientId" INTEGER REFERENCES users(id),
                "campaignId" INTEGER REFERENCES campaigns(id),
                "isInvitation" BOOLEAN DEFAULT false,
                content TEXT NOT NULL,
                "isPublic" BOOLEAN DEFAULT true,
                "postDate" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `)
        console.log('Finished creating tables!');
    } catch (error) {
        console.log('Error creating tables!');
        console.error(error);
    };
};

const createInitialUsers = async () => {
    try {
        console.log('Creating users...');

        const users = [];

        users.push(await createUser({
            username: 'tredding',
            password: 'password1234',
            email: 'tateredding@gmail.com',
            isAdmin: true,
            avatarURL: "../images/default_avatar.svg",
            firstName: 'Tate',
            bio: 'I am the creator of this website!'
        }));

        users.push(await createUser({
            username: 'peaseblossom',
            password: 'myhusbandisamazing',
            email: 'ninasemail@gmail.com',
            lookingForGroup: true,
            firstName: 'Nina',
            location: 'Fort Collins, CO'
        }));

        users.push(await createUser({
            username: 'DavisTheButcher',
            password: 'beefboi55',
            email: 'daviswells@gmail.com',
            lookingForGroup: true,
            avatarURL: "../images/default_avatar.svg",
            firstName: 'Davis',
            surname: 'Wells',
            location: 'The Regional'
        }));

        console.log(users);
        console.log('Finished creating users!')
    } catch (error) {
        console.log('Error creating users!');
        console.error(error);
    };
};

const createInitialCampaigns = async () => {
    try {
        console.log('Creating campaigns...');

        const campaigns = [];

        campaigns.push(await createCampaign({
            creatorId: 1,
            name: 'Curse of Strahd with the FoCo Squad',
            description: 'A (mostly) RAW in person Curse of Strahd campaign.',
            location: 'Fort Collins, CO'
        }));

        campaigns.push(await createCampaign({
            creatorId: 1,
            name: 'The Heroes of Red Larch',
            lookingForPlayers: true,
            location: 'roll20.net'
        }));

        campaigns.push(await createCampaign({
            creatorId: 2,
            name: 'Bee Boop Potato Soup',
            lookingForPlayers: true,
        }));

        campaigns.push(await createCampaign({
            creatorId: 1,
            name: 'Empty Campaign',
            location: 'roll20.net'
        }));

        console.log(campaigns);
        console.log('Finished creating campaigns!');
    } catch (error) {
        console.log('Error creating campaigns!');
        console.error(error);
    };
};

const createInitialCharacters = async () => {
    try {
        console.log('Creating characters...');

        const characters = [];

        characters.push(await createCharacter({
            userId: 1,
            name: 'Tredd Fargrim',
            species: 'dwarf',
            subspecies: 'mountain',
            class: 'paladin',
            alignment: 'lawful-good',
            background: 'noble',
            age: 146,
            height: 41,
            weight: 190,
            eyes: 'brown',
            hair: 'reddish brown',
            skin: 'pale',
            strength: 16,
            dexterity: 9,
            constitution: 14,
            wisdom: 8,
            charisma: 13,
            proficiencies: {
                savingThrows: [
                    'strength',
                    'constitution'
                ],
                skills: [
                    'history',
                    'intimidation',
                    'perception',
                    'religion',
                    'survival'
                ],
                armor: [
                    'light',
                    'medium',
                    'heavy',
                    'shields'
                ],
                weapons: [
                    'simple_melee',
                    'martial_melee',
                    'simple_ranged',
                    'martial_ranged'
                ],
                langauges: [
                    'common',
                    'dwarvish'
                ],
                tools: [
                    "mason's_tools"
                ],
                vehicles: [
                    'land'
                ]
            },
            armorClass: 18,
            maxHitPoints: 12,
            currentHitPoints: 12,
            totalHitDice: {
                'd10': 1
            },
            currentHitDice: {
                'd8': 13
            },
            attacks: {
                attacks: [
                    {
                        name: 'Greataxe',
                        type: 'martial melee',
                        damage: '1d12',
                        damageType: 'slashing'
                    }]
            },
            gold: 100,
            equipment: 'Shield, plate armor, greatsword, 10 torches, 50 feet of hempen rope',
            personalityTraits: 'I have a pretty big ego. I am very easy to get along with.',
            ideals: 'Justice must be served',
            bonds: 'I must protect those who cannot protect themselves',
            flaws: 'I cannot turn down a drink',
            features: {
                species: [
                    'Stonecunning'
                ],
                class: [
                    'Lay on Hands',
                    'Divine Sense'
                ]
            }
        }));

        characters.push(await createCharacter({
            userId: 2,
            name: 'Thyri Littleflower',
            level: 13,
            experience: 168970,
            species: 'elf',
            class: 'druid',
            subclass: 'circle of the land',
            alignment: 'chaotic-good',
            background: 'escaped research relic',
            age: 314,
            height: 71,
            weight: 150,
            eyes: 'yellow',
            hair: 'deep mahogany',
            skin: 'silvery',
            strength: 13,
            dexterity: 13,
            constitution: 14,
            intelligence: 13,
            wisdom: 13,
            charisma: 14,
            proficiencies: {
                savingThrows: [
                    'intelligence',
                    'wisdom'
                ],
                skills: [
                    'animal_handling',
                    'perception',
                    'survival'
                ],
                armor: [
                    'light',
                    'medium',
                    'shields'
                ],
                weapons: [
                    'club',
                    'dagger',
                    'dart',
                    'javelin',
                    'mace',
                    'quarterstaff',
                    'scimitar',
                    'sickle',
                    'sling',
                    'spear'
                ],
                langauges: [
                    'common',
                    'celestial',
                    'druidic',
                    'elvish'
                ]
            },
            armorClass: 14,
            maxHitPoints: 96,
            currentHitPoints: 96,
            temporaryHitPoints: 5,
            totalHitDice: {
                'd8': 13
            },
            currentHitDice: {
                'd8': 13
            },
            attacks: {
                attacks: [
                    {
                        name: 'Quarterstaff (One handed)',
                        type: 'simple melee',
                        damage: '1d6',
                        damageType: 'bludgeoning'
                    }, {
                        name: 'Quarterstaff (Two handed)',
                        type: 'simple melee',
                        damage: '1d8',
                        damageType: 'bludgeoning'
                    }, {
                        name: 'Produce Flame',
                        type: 'spell',
                        damage: {
                            1: '1d8',
                            5: '2d8',
                            11: '3d8',
                            17: '4d8'
                        },
                        damageType: 'fire'
                    }
                ]
            },
            spells: {
                spells: [
                    {
                        name: 'Produce Flame',
                        level: 'cantrip',
                        castingTime: '1 action',
                        range: 'self',
                        components: ['v', 's'],
                        duration: '10 minutes',
                        school: 'conjuration',
                        attack: 'ranged',
                        damageType: 'fire',
                        description: 'A flickering flame appears in your hand...'
                    }
                ]
            },
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
            features: {
                species: [
                    'fey ancestry', 
                    'trance'
                ],
                class: [
                    'natural recovery',
                    'Nature\'s ward'
                ],
                feats: [
                    'Lucky'
                ]
            }
        }));

        console.log(characters);
        console.log('Finished creating characters!');
    } catch (error) {
        console.log('Error creating characters!');
        console.error(error);
    };
};

const createInitialUserCampaigns = async () => {
    try {
        console.log('Creating user-campaigns...');

        const userCampaigns = [];

        userCampaigns.push(await createUserCampaign({
            userId: 1,
            campaignId: 1,
            isDM: true
        }));

        userCampaigns.push(await createUserCampaign({
            userId: 2,
            campaignId: 1
        }));

        userCampaigns.push(await createUserCampaign({
            userId: 3,
            campaignId: 1
        }));

        userCampaigns.push(await createUserCampaign({
            userId: 1,
            campaignId: 2,
            isDM: true
        }));

        userCampaigns.push(await createUserCampaign({
            userId: 2,
            campaignId: 2,
            characterId: 2
        }));

        userCampaigns.push(await createUserCampaign({
            userId: 2,
            campaignId: 3,
            isDM: true
        }));

        userCampaigns.push(await createUserCampaign({
            userId: 1,
            campaignId: 3,
            characterId: 1
        }));

        userCampaigns.push(await createUserCampaign({
            userId: 1,
            campaignId: 4,
            isDM: true
        }));

        console.log(userCampaigns);
        console.log('Finished creating user-campaigns');
    } catch (error) {
        console.log('Error creating user-campaigns!');
        console.error(error);
    };
};

const createInitialMessages = async () => {
    try {
        console.log('Creating messages...');

        const messages = [];

        messages.push(await createMessage({
            senderId: 1,
            campaignId: 1,
            content: 'How does this Sunday at 6pm work for the next session?'
        }));

        messages.push(await createMessage({
            senderId: 2,
            campaignId: 1,
            content: 'Sign me up!',
        }));

        messages.push(await createMessage({
            senderId: 3,
            campaignId: 1,
            content: 'Sunday works great!'
        }));

        messages.push(await createMessage({
            senderId: 1,
            campaignId: 2,
            content: 'This is a public message'
        }));

        messages.push(await createMessage({
            senderId: 2,
            recipientId: 1,
            content: 'This is a private message from peaseblossom to tredding',
            isPublic: false
        }));

        messages.push(await createMessage({
            senderId: 1,
            recipientId: 2,
            content: 'This is a private message from tredding to peaseblossom',
            isPublic: false
        }));

        messages.push(await createMessage({
            senderId: 2,
            recipientId: 1,
            content: 'This is another private message from peaseblossom to tredding',
            isPublic: false
        }));

        messages.push(await createMessage({
            senderId: 3,
            recipientId: 1,
            content: 'This is a private message from DavisTheButcher to tredding',
            isPublic: false
        }));

        messages.push(await createMessage({
            senderId: 2,
            recipientId: 3,
            campaignId: 3,
            isInvitation: true,
            content: 'This is an invitation to Davis to join Bee Boop Potato Soup',
            isPublic: false
        }));

        messages.push(await createMessage({
            senderId: 3,
            recipientId: 1,
            campaignId: 2,
            isInvitation: true,
            content: 'This is a request from Davis to join The Heroes of Red Larch',
            isPublic: false
        }));

        console.log(messages);
        console.log('Finished creating messages!');
    } catch (error) {
        console.log('Error creating messages!');
        console.error(error);
    };
};

const rebuildDB = async () => {
    try {
        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialCampaigns();
        await createInitialCharacters();
        await createInitialUserCampaigns();
        await createInitialMessages();
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    rebuildDB,
    dropTables,
    createTables
};