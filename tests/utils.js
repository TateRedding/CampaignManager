const { faker } = require("@faker-js/faker");
const { createUser } = require("../db/users");
const { createCampaign } = require("../db/campaigns");
const { createUserCampaign, getUserCampaignsByCampaignId } = require("../db/user_campaigns");
const { createMessage } = require("../db/messages");
const { createCharacter } = require("../db/characters");

const createFakeUser = async ({
    username = faker.datatype.uuid(),
    password = faker.internet.password()
}) => {
    {
        const fakeUserData = {
            username,
            password,
            email: faker.internet.email()
        };
        const user = await createUser(fakeUserData);
        if (!user) {
            throw new Error("createUser didn't return a user");
        };
        return user;
    };
};

const createFakeUserLookingForGroup = async () => {
    const fakeUserData = {
        username: faker.datatype.uuid(),
        password: faker.internet.password(),
        email: faker.internet.email(),
        lookingForGroup: true
    }
    const user = await createUser(fakeUserData);
    if (!user) {
        throw new Error("createUser didn't return a user");
    };
    return user;
};

const createFakeCampaign = async ({
    creatorId,
    name = `${faker.word.adjective()} ${faker.word.noun()}`,
    isPublic = true
}) => {
    if (!creatorId) {
        const user = await createFakeUser({});
        creatorId = user.id
    };
    const campaign = await createCampaign({
        creatorId,
        name,
        isPublic
    });
    if (!campaign) {
        throw new Error("createCampaign didn't return a campaign");
    };
    return campaign;
};

const createFakeUserCampaign = async ({ userId, campaignId }) => {
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
        campaignId
    });
    if (!fakeUserCampaign) {
        throw new Error("createCampaign didn't return a campaign");
    };
    return fakeUserCampaign;

};

const createFakeCampaignWithUserCampaigns = async (numUsers, creatorId) => {
    if (numUsers <= 0) {
        numUsers = 1
    };
    if (!creatorId) {
        const creator = await createFakeUser({});
        creatorId = creator.id;
    }
    const campaign = await createFakeCampaign({ creatorId });
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
    isPublic = true,
    isInvitation = false
}) => {
    if (!senderId) {
        const user = await createFakeUser({});
        senderId = user.id;
    };
    if (!campaignId) {
        const campaign = await createFakeCampaign({});
        campaignId = campaign.id;
    };
    if ((!isPublic || isInvitation) && !recipientId) {
        const user = await createFakeUser({});
        recipientId = user.id;
    };
    const fakeMessageData = {
        senderId,
        campaignId,
        content: faker.datatype.string(100),
        isPublic,
        isInvitation
    };
    if (recipientId) {
        fakeMessageData.recipientId = recipientId;
    };
    const message = await createMessage(fakeMessageData);
    return message;
};

const createFakeCampaignWithUserCampaignsAndMessages = async (numUsers, numPublicMessages, numPrivateMessages) => {
    if (numPrivateMessages > 0 && numUsers <= 1) {
        numUsers = 2;
    };
    if (numUsers <= 0) {
        numUsers = 1;
    };
    const campaign = await createFakeCampaignWithUserCampaigns(numUsers);
    const users = await getUserCampaignsByCampaignId(campaign.id);
    let senderIdx = 0;
    for (let i = 0; i < numPublicMessages; i++) {
        await createFakeMessage({
            senderId: users[senderIdx].userId,
            campaignId: campaign.id
        });
        senderIdx++;
        if (senderIdx >= users.length - 1) {
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
            isPublic: false,
        });
        senderIdx++;
        recipientIdx++;
        if (senderIdx >= users.length - 1) {
            senderIdx = 0;
        };
        if (recipientIdx >= users.length - 1) {
            recipientIdx = 0;
        };
    };
    return campaign;
};

const createFakeCharacter = async ({
    userId,
    campaignId,
    isPublic = true,
    name = faker.name.fullName(),
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
    const randInt = (max, min) => {
        if (!min) {
            min = 0;
        };
        return Math.floor(Math.random() * (max - min)) + min;
    };
    if (!userId) {
        const user = await createFakeUser({});
        userId = user.id;
    };
    const alignment = alignments[randInt(alignments.length)];
    const fakeCharacterData = {
        userId,
        isPublic,
        name,
        species: faker.word.noun(),
        class: faker.word.adjective(),
        alignment,
        background: `${faker.word.noun()} ${faker.word.adjective()}`,
        age: randInt(350, 18),
        height: randInt(75, 10),
        weight: randInt(250, 100),
        eyes: faker.color.human(),
        hair: faker.color.human(),
        skin: faker.color.human(),
        proficiencies: {},
        totalHitDice: { 'd10': 1 },
        currentHitDice: { 'd10': 1 },
        features: {}
    };
    if (campaignId) {
        fakeCharacterData.campaignId = campaignId;
    };
    const character = await createCharacter(fakeCharacterData);
    return character;
};

module.exports = {
    createFakeUser,
    createFakeUserLookingForGroup,
    createFakeCampaign,
    createFakeUserCampaign,
    createFakeCampaignWithUserCampaigns,
    createFakeMessage,
    createFakeCampaignWithUserCampaignsAndMessages,
    createFakeCharacter
};