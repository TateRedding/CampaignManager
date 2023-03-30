const client = require('./index');
const { createUser } = require('./users');
const { createCampaign } = require('./campaigns');
const { createUserCampaign } = require('./user_campaigns');
const { createMessage } = require('./messages');

const dropTables = async () => {
    try {
        console.log('Dropping tables...');
        await client.query(`
            DROP TABLE IF EXISTS user_campaigns;
            DROP TABLE IF EXISTS messages;
            DROP TABLE IF EXISTS characters;
            DROP TABLE IF EXISTS proficiencies;
            DROP TABLE IF EXISTS campaigns;
            DROP TABLE IF EXISTS users;
            DROP TYPE IF EXISTS alignment;
            DROP TYPE IF EXISTS class;
            DROP TYPE IF EXISTS hitdie;
            DROP TYPE IF EXISTS species;
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

            CREATE TYPE class AS ENUM (
                'barbarian',
                'bard',
                'cleric',
                'druid',
                'fighter',
                'monk',
                'paladin',
                'ranger',
                'rogue',
                'sorcerer',
                'warlock',
                'wizard'
            );

            CREATE TYPE hitdie AS ENUM (
                'd6',
                'd8',
                'd10',
                'd12'
            );

            CREATE TYPE species AS ENUM (
                'dwarf',
                'elf',
                'halfling',
                'half-elf',
                'half-orc',
                'human',
                'dragonborn',
                'gnome',
                'tiefling'
            );

            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(100) NOT NULL,
                email VARCHAR(150) NOT NULL,
                active BOOLEAN DEFAULT true,
                firstname VARCHAR(100),
                surname VARCHAR(100),
                location VARCHAR(100),
                bio TEXT
            );

            CREATE TABLE campaigns (
                id SERIAL PRIMARY KEY,
                "creatorId" INTEGER REFERENCES users(id) NOT NULL,
                public BOOLEAN DEFAULT true,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                location VARCHAR(255),
                "creationDate" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE user_campaigns (
                id SERIAL PRIMARY KEY,
                "userId" INTEGER NOT NULL REFERENCES users(id),
                "campaignId" INTEGER NOT NULL REFERENCES campaigns(id),
                "isDM" BOOLEAN DEFAULT FALSE,
                UNIQUE ("userId", "campaignId")
            );

            CREATE TABLE messages (
                id SERIAL PRIMARY KEY,
                "senderId" INTEGER NOT NULL REFERENCES users(id),
                "recipientId" INTEGER REFERENCES users(id),
                "campaignId" INTEGER NOT NULL REFERENCES campaigns(id),
                content TEXT NOT NULL,
                public BOOLEAN DEFAULT true,
                "postDate" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE proficiencies (
                id SERIAL PRIMARY KEY,
                strength BOOLEAN DEFAULT false,
                dexterity BOOLEAN DEFAULT false,
                constitution BOOLEAN DEFAULT false,
                intelligence BOOLEAN DEFAULT false,
                wisdom BOOLEAN DEFAULT false,
                charisma BOOLEAN DEFAULT false,
                acrobatics BOOLEAN DEFAULT false,
                "animalHandling" BOOLEAN DEFAULT false,
                arcana BOOLEAN DEFAULT false,
                athletics BOOLEAN DEFAULT false,
                deception BOOLEAN DEFAULT false,
                history BOOLEAN DEFAULT false,
                insight BOOLEAN DEFAULT false,
                intimidation BOOLEAN DEFAULT false,
                investigation BOOLEAN DEFAULT false,
                medicine BOOLEAN DEFAULT false,
                nature BOOLEAN DEFAULT false,
                perception BOOLEAN DEFAULT false,
                performance BOOLEAN DEFAULT false,
                persuasion BOOLEAN DEFAULT false,
                religion BOOLEAN DEFAULT false,
                "sleightOfHand" BOOLEAN DEFAULT false,
                survival BOOLEAN DEFAULT false,
                "simpleMeleeWeapons" BOOLEAN DEFAULT false,
                "martialMeleeWeapons" BOOLEAN DEFAULT false,
                "simpleRangedWeapons" BOOLEAN DEFAULT false,
                "martialRangedWeapons" BOOLEAN DEFAULT false,
                "lightArmor" BOOLEAN DEFAULT false,
                "mediumArmor" BOOLEAN DEFAULT false,
                "heavyArmor" BOOLEAN DEFAULT false,
                shields BOOLEAN DEFAULT false,
                "landVehicles" BOOLEAN DEFAULT false,
                "waterVehicles" BOOLEAN DEFAULT false,
                "alchemistSupplies" BOOLEAN DEFAULT false,
                "brewerSupplies" BOOLEAN DEFAULT false,
                "calligrapherSupplies" BOOLEAN DEFAULT false,
                "carpenterTools" BOOLEAN DEFAULT false,
                "cartographerTools" BOOLEAN DEFAULT false,
                "cobblerTools" BOOLEAN DEFAULT false,
                "cookUtensils" BOOLEAN DEFAULT false,
                "glassblowerTools" BOOLEAN DEFAULT false,
                "jewelerTools" BOOLEAN DEFAULT false,
                "leatherworkerTools" BOOLEAN DEFAULT false,
                "masonTools" BOOLEAN DEFAULT false,
                "painterSupplies" BOOLEAN DEFAULT false,
                "potterTools" BOOLEAN DEFAULT false,
                "smithTools" BOOLEAN DEFAULT false,
                "tinkerTools" BOOLEAN DEFAULT false,
                "weaverTools" BOOLEAN DEFAULT false,
                "woodcarverTools" BOOLEAN DEFAULT false,
                "disguiseKit" BOOLEAN DEFAULT false,
                "forgeryKit" BOOLEAN DEFAULT false,
                "diceSet" BOOLEAN DEFAULT false,
                "dragonchessSet" BOOLEAN DEFAULT false,
                "playingCardSet" BOOLEAN DEFAULT false,
                "threeDragonAnteSet" BOOLEAN DEFAULT false,
                "herbalismKit" BOOLEAN DEFAULT false,
                bagpipes BOOLEAN DEFAULT false,
                drum BOOLEAN DEFAULT false,
                dulcimer BOOLEAN DEFAULT false,
                flute BOOLEAN DEFAULT false,
                lute BOOLEAN DEFAULT false,
                lyre BOOLEAN DEFAULT false,
                horn BOOLEAN DEFAULT false,
                "panFlute" BOOLEAN DEFAULT false,
                shawm BOOLEAN DEFAULT false,
                viol BOOLEAN DEFAULT false,
                "navigatorTools" BOOLEAN DEFAULT false,
                "poisonerTools" BOOLEAN DEFAULT false,
                "thieveTools" BOOLEAN DEFAULT false
            );

            CREATE TABLE characters (
                id SERIAL PRIMARY KEY,
                "userId" INTEGER NOT NULL REFERENCES users(id),
                "campaignId" INTEGER REFERENCES campaigns(id),
                public BOOLEAN DEFAULT true,
                name VARCHAR(100) NOT NULL,
                level INTEGER NOT NULL DEFAULT 1,
                species SPECIES NOT NULL,
                class CLASS NOT NULL,
                subclass VARCHAR(50),
                alignment ALIGNMENT NOT NULL,
                background VARCHAR(100) NOT NULL,
                age INTEGER,
                height VARCHAR(50),
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
                proficiencies INTEGER NOT NULL REFERENCES proficiencies(id),
                "armorClass" INTEGER DEFAULT 10,
                speed INTEGER DEFAULT 25,
                "maxHitPoints" INTEGER,
                "currentHitPoints" INTEGER,
                "temporaryHitPoints" INTEGER,
                "hitDieType" HITDIE,
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
                features TEXT
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

        const userOne = await createUser({
            username: 'tredding',
            password: '12345',
            email: 'tateredding@gmail.com',
            firstname: 'Tate',
            bio: 'I am the creator of this website!'
        });

        const userTwo = await createUser({
            username: 'peaseblossom',
            password: '12345',
            email: 'ninasemail@gmail.com',
            firstname: 'Nina',
            location: 'Fort Collins, CO'
        });

        const userThree = await createUser({
            username: 'DavisTheButcher',
            password: '12345',
            email: 'daviswells@gmail.com',
            firstname: 'Davis',
            surname: 'Wells',
            location: 'The Regional'
        });

        console.log([ userOne, userTwo, userThree ]);
        console.log('Finished creating users!')
    } catch (error) {
        console.log('Error creating users!');
        console.error(error);
    };
};

const createInitialCampaigns = async () => {
    try {
        console.log('Creating campaigns...');

        const campaignOne = await createCampaign({
            creatorId: 1,
            name: 'Curse of Strahd with the FoCo Squad',
            description: 'A (mostly) RAW in person Curse of Strahd campaign.',
            location: 'Fort Collins, CO'
        });

        const campaignTwo = await createCampaign({
            creatorId: 1,
            name: 'The Heroes of Red Larch',
            public: false,
            location: 'roll20.com'
        });

        const campaignThree = await createCampaign({
            creatorId: 2,
            name: 'Bee Boop Potato Soup'
        });

        console.log([ campaignOne, campaignTwo, campaignThree ]);
        console.log('Finished creating campaigns!');
    } catch (error) {
        console.log('Error creating campaigns!');
        console.error(error);
    };
};

const createInitialUserCampaigns = async () => {
    try {
        console.log('Creating user-campaigns...');

        const userCampaignOne = await createUserCampaign({
            userId: 1,
            campaignId: 1,
            isDM: true
        });

        const userCampaignTwo = await createUserCampaign({
            userId: 2,
            campaignId: 1
        });

        const userCampaignThree = await createUserCampaign({
            userId: 3,
            campaignId: 1
        });

        const userCampaignFour = await createUserCampaign({
            userId: 1,
            campaignId: 2,
            isDM: true
        });

        const userCampaignFive = await createUserCampaign({
            userId: 2,
            campaignId: 2
        });

        const userCampaignSix = await createUserCampaign({
            userId: 2,
            campaignId: 3,
            isDM: true
        });

        const userCampaignSeven = await createUserCampaign({
            userId: 1,
            campaignId: 3
        });

        console.log([
            userCampaignOne,
            userCampaignTwo,
            userCampaignThree,
            userCampaignFour,
            userCampaignFive,
            userCampaignSix,
            userCampaignSeven
        ]);
        console.log('Finished creating user-campaigns');
    } catch (error) {
        console.log('Error creating user-campaigns!');
        console.error(error);
    };
};

const createInitialMessages = async () => {
    try {
        console.log('Creating messages...');

        const messageOne = await createMessage({
            senderId: 1,
            campaignId: 1,
            content: 'How does this Sunday at 6pm work for the next session?'
        });

        const messageTwo = await createMessage({
            senderId: 2,
            campaignId: 1,
            content: 'Sign me up!',
        });

        const messageThree = await createMessage({
            senderId: 3,
            campaignId: 1,
            content: 'Sunday works great!'
        });

        const messageFour = await createMessage({
            senderId: 1,
            campaignId: 2,
            content: 'This is a public message'
        });

        const messageFive = await createMessage({
            senderId: 2,
            recipientId: 1,
            campaignId: 2,
            content: 'This is a private message',
            public: false
        });

        console.log([
            messageOne,
            messageTwo,
            messageThree,
            messageFour,
            messageFive
        ]);
        console.log('Finished creating messages!');
    } catch (error) {
        console.log('Error creating messages!');
        console.error(error);
    };
};

const rebuildDB = async () => {
    try {
        client.connect();
        await dropTables();
        await createTables();
    } catch (error) {
        console.error(error);
    };
};

const testDB = async () => {
    try {
        console.log('Testing database...');
        await createInitialUsers();
        await createInitialCampaigns();
        await createInitialUserCampaigns();
        await createInitialMessages();
        console.log('Finished testing database!')
    } catch (error) {
        console.error(error);
    };
};

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());