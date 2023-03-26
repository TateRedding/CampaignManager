const client = require('./index');

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
            DROP TYPE IF EXISTS class;
            DROP TYPE IF EXISTS hitdie;
            DROP TYPE IF EXISTS species;
        `);
        console.log('Finished dropping tables.');
    } catch (error) {
        console.log('Error when dropping tables!');
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
                active BOOLEAN DEFAULT true,
                firstname VARCHAR(100),
                surname VARCHAR(100),
                location VARCHAR(100),
                bio TEXT
            );

            CREATE TABLE campaigns (
                id SERIAL PRIMARY KEY,
                "creatorId" INTEGER REFERENCES users(id) NOT NULL,
                "dmID" INTEGER REFERENCES users(id) NOT NULL,
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
                inspired BOOLEAN DEFAULT false,
                strength INTEGER DEFAULT 10,
                dexterity INTEGER DEFAULT 10,
                constitution INTEGER DEFAULT 10,
                intelligence INTEGER DEFAULT 10,
                wisdom INTEGER DEFAULT 10,
                charisma INTEGER DEFAULT 10,
                "strSaveProficient" BOOLEAN DEFAULT false,
                "dexSaveProficient" BOOLEAN DEFAULT false,
                "conSaveProficient" BOOLEAN DEFAULT false,
                "intSaveProficient" BOOLEAN DEFAULT false,
                "wisSaveProficient" BOOLEAN DEFAULT false,
                "chaSaveProficient" BOOLEAN DEFAULT false,
                "acrobaticsProficient" BOOLEAN DEFAULT false,
                "animalHandlingProficient" BOOLEAN DEFAULT false,
                "arcanaProficient" BOOLEAN DEFAULT false,
                "athleticsProficient" BOOLEAN DEFAULT false,
                "deceptionProficient" BOOLEAN DEFAULT false,
                "historyProficient" BOOLEAN DEFAULT false,
                "insightProficient" BOOLEAN DEFAULT false,
                "initmidationProficient" BOOLEAN DEFAULT false,
                "investigationProficient" BOOLEAN DEFAULT false,
                "medicineProficient" BOOLEAN DEFAULT false,
                "natureProficient" BOOLEAN DEFAULT false,
                "perceptionProficient" BOOLEAN DEFAULT false,
                "performanceProficient" BOOLEAN DEFAULT false,
                "persuasionProficient" BOOLEAN DEFAULT false,
                "religionProficient" BOOLEAN DEFAULT false,
                "sleightOfHandProficient" BOOLEAN DEFAULT false,
                "stealthProficient" BOOLEAN DEFAULT false,
                "survivalProficient" BOOLEAN DEFAULT false,
                "otherProficiencies" TEXT,
                "armorClass" INTEGER DEFAULT 10,
                speed INTEGER DEFAULT 25,
                "maxHitPoints" INTEGER,
                "currentHitPoints" INTEGER,
                "temporaryHitPoints" INTEGER,
                "hitDieType" HITDIE,
                "deathSaveSuccesses" INTEGER DEFAULT 0,
                "deathSaveFailures" INTEGER DEFAULT 0,
                attacks TEXT,
                spells TEXT,
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
    } catch (error) {
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
        console.log('Finished testing database!')
    } catch (error) {
        console.error(error);
    };
};

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());