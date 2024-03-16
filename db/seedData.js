const client = require('./client');
const { createUser } = require('./users');
const { createCampaign } = require('./campaigns');
const { createUserCampaign } = require('./user_campaigns');
const { createMessage } = require('./messages');
const { createCharacter } = require('./characters');
const { treddFargrim, thyriLittleflower } = require('./characterObjects');

const dropTables = async () => {
    try {
        console.log('Dropping tables...');
        await client.query(`
            DROP TABLE IF EXISTS user_campaigns;
            DROP TABLE IF EXISTS messages;
            DROP TABLE IF EXISTS characters;
            DROP TABLE IF EXISTS campaigns;
            DROP TABLE IF EXISTS users;
            DROP TYPE IF EXISTS abilities;
            DROP TYPE IF EXISTS alignment;
            DROP TYPE IF EXISTS ability;
            DROP TYPE IF EXISTS message_type;
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
            CREATE TYPE ability AS ENUM (
                'strength',
                'dexterity',
                'constitution',
                'intelligence',
                'wisdom',
                'charisma'
            );

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

            CREATE TYPE message_type AS ENUM (
                'invitation',
                'join_request',
                'private',
                'public'
            );

            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(150) NOT NULL,
                email VARCHAR(150) NOT NULL,
                "registerTime" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                "lookingForGroup" BOOLEAN DEFAULT false,
                "isActive" BOOLEAN DEFAULT false,
                "isAdmin" BOOLEAN DEFAULT false,
                "deactivationTime" TIMESTAMPTZ,
                "avatarURL" text NOT NULL,
                "firstName" VARCHAR(100),
                "lastName" VARCHAR(100),
                bio TEXT
            );

            CREATE TABLE campaigns (
                id SERIAL PRIMARY KEY,
                "creatorId" INTEGER REFERENCES users(id) NOT NULL,
                name VARCHAR(255) NOT NULL,
                path VARCHAR(255) NOT NULL,
                location VARCHAR(255),
                "creationTime" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "isOpen" BOOLEAN DEFAULT false
            );
 
            CREATE TABLE characters (
                id SERIAL PRIMARY KEY,
                "userId" INTEGER NOT NULL REFERENCES users(id),
                "campaignId" INTEGER REFERENCES campaigns(id),
                name VARCHAR(100) NOT NULL,
                level INTEGER DEFAULT 1,
                experience INTEGER DEFAULT 0,
                species VARCHAR(50),
                subspecies VARCHAR(50),
                class JSONB[],
                alignment alignment,
                background VARCHAR(100),
                age INTEGER,
                height INTEGER,
                weight INTEGER,
                eyes VARCHAR(35),
                hair VARCHAR(35),
                skin VARCHAR(35),
                abilities JSONB,
                skills JSONB,
                "proficiencyBonus" INTEGER DEFAULT 2,
                "passivePerception" INTEGER DEFAULT 10,
                "otherProficiencies" TEXT,
                inspiration BOOLEAN DEFAULT false,
                "armorClass" INTEGER DEFAULT 10,
                initiative INTEGER DEFAULT 0,
                speed INTEGER DEFAULT 25,
                "hitPoints" INTEGER DEFAULT 8,
                "currentHitPoints" INTEGER DEFAULT 8,
                "temporaryHitPoints" INTEGER DEFAULT 0,
                "hitDice" JSONB[],
                "deathSaveSuccesses" INTEGER DEFAULT 0,
                "deathSaveFailures" INTEGER DEFAULT 0,
                attacks JSONB[],
                spells JSONB[],
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
                "featuresAndTraits" TEXT,
                backstory TEXT,
                treasure TEXT,
                "additionalFeaturesAndTraits" TEXT,
                "alliesAndOrganizations" TEXT,
                "spellcastingAbility" ability,
                "spellSaveDC" INTEGER,
                "spellAttackBonus" INTEGER
            );

            CREATE TABLE user_campaigns (
                id SERIAL PRIMARY KEY,
                "userId" INTEGER NOT NULL REFERENCES users(id),
                "campaignId" INTEGER NOT NULL REFERENCES campaigns(id),
                "isDM" BOOLEAN DEFAULT false,
                "canEdit" BOOLEAN DEFAULT false,
                UNIQUE ("userId", "campaignId")
            );

            CREATE TABLE messages (
                id SERIAL PRIMARY KEY,
                "senderId" INTEGER NOT NULL REFERENCES users(id),
                "recipientId" INTEGER REFERENCES users(id),
                "campaignId" INTEGER REFERENCES campaigns(id),
                type message_type DEFAULT 'public',
                content TEXT NOT NULL,
                "postTime" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
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
            avatarURL: "../images/default_avatar.svg",
            lookingForGroup: true,
            firstName: 'Nina',
        }));

        users.push(await createUser({
            username: 'DavisTheButcher',
            password: 'beefboi55',
            email: 'daviswells@gmail.com',
            lookingForGroup: true,
            avatarURL: "../images/default_avatar.svg",
            firstName: 'Davis',
            lastName: 'Wells',
        }));

        //console.log(users);
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
            path: 'CoSwtFS',
            location: 'Fort Collins, CO'
        }));

        campaigns.push(await createCampaign({
            creatorId: 1,
            name: 'The Heroes of Red Larch',
            path: 'The_Heroes_of_Red_Larch',
            isOpen: true,
            location: 'roll20.net'
        }));

        campaigns.push(await createCampaign({
            creatorId: 2,
            name: 'Bee Boop Potato Soup',
            path: 'Bee_Boop_Potato_Soup',
            isOpen: true,
        }));

        campaigns.push(await createCampaign({
            creatorId: 1,
            name: 'Empty Campaign',
            path: 'Empty_Campaign',
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

        characters.push(await createCharacter(treddFargrim));
        characters.push(await createCharacter(thyriLittleflower));

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
            isDM: true,
            canEdit: true
        }));

        userCampaigns.push(await createUserCampaign({
            userId: 2,
            campaignId: 1,
            canEdit: true
        }));

        userCampaigns.push(await createUserCampaign({
            userId: 3,
            campaignId: 1
        }));

        userCampaigns.push(await createUserCampaign({
            userId: 1,
            campaignId: 2,
            isDM: true,
            canEdit: true
        }));

        userCampaigns.push(await createUserCampaign({
            userId: 2,
            campaignId: 2,
        }));

        userCampaigns.push(await createUserCampaign({
            userId: 2,
            campaignId: 3,
            isDM: true,
            canEdit: true
        }));

        userCampaigns.push(await createUserCampaign({
            userId: 1,
            campaignId: 3,
        }));

        userCampaigns.push(await createUserCampaign({
            userId: 1,
            campaignId: 4,
            isDM: true,
            canEdit: true
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
            type: 'private',
            content: 'This is a private message from peaseblossom to tredding'
        }));

        messages.push(await createMessage({
            senderId: 1,
            recipientId: 2,
            type: 'private',
            content: 'This is a private message from tredding to peaseblossom'
        }));

        messages.push(await createMessage({
            senderId: 2,
            recipientId: 1,
            type: 'private',
            content: 'This is another private message from peaseblossom to tredding'
        }));

        messages.push(await createMessage({
            senderId: 3,
            recipientId: 1,
            type: 'private',
            content: 'This is a private message from DavisTheButcher to tredding'
        }));

        messages.push(await createMessage({
            senderId: 2,
            recipientId: 3,
            campaignId: 3,
            type: 'invitation',
            content: 'This is an invitation to Davis to join Bee Boop Potato Soup'
        }));

        messages.push(await createMessage({
            senderId: 3,
            recipientId: 1,
            campaignId: 2,
            type: 'join_request',
            content: 'This is a request from Davis to join The Heroes of Red Larch',
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
        //await createInitialCampaigns();
        await createInitialCharacters();
        //await createInitialUserCampaigns();
        //await createInitialMessages();
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    rebuildDB,
    dropTables,
    createTables
};