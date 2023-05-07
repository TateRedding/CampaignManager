const { faker } = require("@faker-js/faker");
const { createUser } = require("../db/users");
const { createCampaign } = require("../db/campaigns");
const { createUserCampaign } = require("../db/user_campaigns");

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
    name = `${faker.word.adjective()} ${faker.word.noun()}`
}) => {
    if (!creatorId) {
        const user = await createFakeUser({});
        creatorId = user.id
    };
    const campaign = await createCampaign({ creatorId, name });
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

const createFakeCampaignWithUserCampaigns = async (numUsers) => {
    if (numUsers <= 0) {
        numUsers = 1
    };
    const creator = await createFakeUser({});
    const campaign = await createFakeCampaign({ creatorId: creator.id });
    await createFakeUserCampaign({
        userId: creator.id,
        campaignId: campaign.id
    });
    for (let i = 0; i < numUsers-1; i++) {
        const user = await createFakeUser({});
        await createFakeUserCampaign({
            userId: user.id,
            campaignId: campaign.id
        });
    };
    return campaign;
}

module.exports = {
    createFakeUser,
    createFakeUserLookingForGroup,
    createFakeCampaign,
    createFakeUserCampaign,
    createFakeCampaignWithUserCampaigns
};