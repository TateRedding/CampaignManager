const client = require('../db/client');
const { faker } = require("@faker-js/faker");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const { JWTS } = process.env;
const { createUser } = require("../db/users");
const { createCampaign } = require("../db/campaigns");
const { createUserCampaign, getUserCampaignsByCampaignId } = require("../db/user_campaigns");
const { createMessage } = require("../db/messages");
const { createCharacter } = require("../db/characters");
const { defaultAbilities, defaultSkills } = require("../db/characterObjects");

const emptyTables = async () => {
    await client.query(`
        DELETE FROM user_campaigns;
        DELETE FROM messages;
        DELETE FROM characters;
        DELETE FROM campaigns;
        DELETE FROM users;
    `);
};

const expectToBeError = (body, name) => {
    expect(body).toEqual({
        name,
        message: expect.any(String)
    });
};

const expectNotToBeError = (body) => {
    expect(body).not.toEqual({
        name: expect.any(String),
        message: expect.any(String)
    });
};

const expectToMatchObjectWithDates = (firstObject, secondObject) => {
    for (const key of Object.keys(firstObject)) {
        if (typeof firstObject[key] === 'object' && Date.parse(firstObject[key])) {
            firstObject[key] = firstObject[key].toISOString();
        }
        if (typeof secondObject[key] === 'object' && Date.parse(secondObject[key])) {
            secondObject[key] = secondObject[key].toISOString();
        }
        expect(firstObject[key]).toEqual(secondObject[key]);
    }
};

const randInt = (max, min) => {
    if (!min) {
        min = 0;
    };
    return Math.floor(Math.random() * (max - min)) + min;
};

const createFakeUser = async ({
    username = faker.string.uuid(),
    password = faker.internet.password(),
    isAdmin = false,
    lookingForGroup = false
}) => {
    const fakeUserData = {
        username,
        password,
        email: faker.internet.email(),
        isAdmin,
        lookingForGroup,
        avatarURL: "./images/default_avatar.svg"
    };
    const user = await createUser(fakeUserData);
    if (!user) {
        throw new Error("createUser didn't return a user");
    };
    return user;
};

const createFakeUserWithToken = async ({
    username = faker.string.uuid(),
    password = faker.internet.password(),
    isAdmin = false,
    lookingForGroup = false
}) => {
    const user = await createFakeUser({
        username,
        password,
        isAdmin,
        lookingForGroup
    });
    const token = jwt.sign({
        id: user.id,
        username: user.username
    },
        JWTS,
        { expiresIn: "1w" }
    );
    return {
        user,
        token
    };
};

const createFakeCampaign = async ({
    creatorId,
    name = `${faker.word.adjective()} ${faker.word.noun()}`,
    isOpen = true
}) => {
    if (!creatorId) {
        const user = await createFakeUser({});
        creatorId = user.id
    };
    const campaign = await createCampaign({
        creatorId,
        name,
        path: name,
        isOpen
    });
    if (!campaign) {
        throw new Error("createCampaign didn't return a campaign");
    };
    return campaign;
};

const createFakeUserCampaign = async ({
    userId,
    campaignId,
    isDM = false
}) => {
    if (!userId) {
        const user = await createFakeUser({});
        userId = user.id;
    };
    if (!campaignId) {
        const campaign = await createFakeCampaign({});
        campaignId = campaign.id
    };
    const fakeUserCampaign = await createUserCampaign({
        userId,
        campaignId,
        isDM
    });
    if (!fakeUserCampaign) {
        throw new Error("createCampaign didn't return a campaign");
    };
    return fakeUserCampaign;

};

const createFakeCampaignWithUserCampaigns = async ({
    numUsers,
    creatorId,
    isOpen = true,
}) => {
    if (numUsers <= 0 || numUsers === undefined) {
        numUsers = 1
    };
    if (!creatorId) {
        const creator = await createFakeUser({});
        creatorId = creator.id;
    };
    const campaign = await createFakeCampaign({
        creatorId,
        isOpen,
    });
    await createFakeUserCampaign({
        userId: creatorId,
        campaignId: campaign.id
    });
    for (let i = 0; i < numUsers - 1; i++) {
        const user = await createFakeUser({});
        await createFakeUserCampaign({
            userId: user.id,
            campaignId: campaign.id
        });
    };
    return campaign;
};

const createFakeMessage = async ({
    senderId,
    campaignId,
    recipientId,
    type = 'public'
}) => {
    if (!senderId) {
        const user = await createFakeUser({});
        senderId = user.id;
    };
    if ((type !== "public") && !recipientId) {
        const user = await createFakeUser({});
        recipientId = user.id;
    };
    const fakeMessageData = {
        senderId,
        campaignId,
        content: faker.string.sample(100),
        type
    };
    if (recipientId) {
        fakeMessageData.recipientId = recipientId;
    };
    const message = await createMessage(fakeMessageData);
    return message;
};

const createFakeCampaignWithUserCampaignsAndMessages = async ({
    numUsers,
    numPublicMessages = 0,
    numPrivateMessages = 0,
    creatorId
}) => {
    if (numPrivateMessages > 0 && numUsers <= 1) {
        numUsers = 2;
    };
    if (numUsers <= 0) {
        numUsers = 1;
    };
    const campaign = await createFakeCampaignWithUserCampaigns({ numUsers, creatorId });
    const users = await getUserCampaignsByCampaignId(campaign.id);
    let senderIdx = 0;
    for (let i = 0; i < numPublicMessages; i++) {
        await createFakeMessage({
            senderId: users[senderIdx].userId,
            campaignId: campaign.id
        });
        senderIdx++;
        if (senderIdx >= users.length) {
            senderIdx = 0;
        };
    };
    senderIdx = 0;
    let recipientIdx = 1;
    for (let j = 0; j < numPrivateMessages; j++) {
         await createFakeMessage({
            senderId: users[senderIdx].userId,
            recipientId: users[recipientIdx].userId,
            campaignId: campaign.id,
            type: 'private',
        });
        senderIdx++;
        recipientIdx++;
        if (senderIdx >= users.length) {
            senderIdx = 0;
        };
        if (recipientIdx >= users.length) {
            recipientIdx = 0;
        };
    };
    return campaign;
};

const createFakeCharacter = async ({
    userId,
    campaignId,
    name = faker.person.fullName(),
}) => {
    const alignments = [
        'lawful-good',
        'neutral-good',
        'chaotic-good',
        'lawful-neutral',
        'true-neutral',
        'chaotic-neutral',
        'lawful-evil',
        'neutral-evil',
        'chaotic-evil'
    ];
    if (!userId) {
        const user = await createFakeUser({});
        userId = user.id;
    };
    const alignment = alignments[randInt(alignments.length)];
    const fakeCharacterData = {
        userId,
        name,
        species: faker.word.noun(),
        class: [{
            baseClass: faker.word.adjective(),
            subClass: null,
            level: 1
        }],
        alignment,
        background: `${faker.word.noun()} ${faker.word.adjective()}`,
        age: randInt(350, 18),
        height: randInt(75, 10),
        weight: randInt(250, 100),
        eyes: faker.color.human(),
        hair: faker.color.human(),
        skin: faker.color.human(),
        abilities: defaultAbilities,
        skills: defaultSkills,
        hitDice: [{
            dieType: 6,
            total: 1,
            remaining: 1
        }]
    };
    if (campaignId) {
        fakeCharacterData.campaignId = campaignId;
    };
    const character = await createCharacter(fakeCharacterData);
    return character;
};

module.exports = {
    emptyTables,
    expectToBeError,
    expectNotToBeError,
    expectToMatchObjectWithDates,
    randInt,
    createFakeUser,
    createFakeUserWithToken,
    createFakeCampaign,
    createFakeUserCampaign,
    createFakeCampaignWithUserCampaigns,
    createFakeMessage,
    createFakeCampaignWithUserCampaignsAndMessages,
    createFakeCharacter,
};