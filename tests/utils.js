const { faker } = require("@faker-js/faker");
const { createUser } = require("../db/users");
const { createCampaign } = require("../db/campaigns");

const createFakeUser = async ({
    username = faker.internet.userName(),
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
        username: faker.internet.userName(),
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

const createFakeCampaign = async (name = `${faker.word.adjective()} ${faker.word.noun()}`) => {
    const fakeUser = await createFakeUser({});
    const fakeCampaignData = {
        creatorId: fakeUser.id,
        name
    };
    const campaign = await createCampaign(fakeCampaignData);
    if (!campaign) {
        throw new Error("createCampaign didn't return a campaign");
    };
    return campaign;
}

module.exports = {
    createFakeUser,
    createFakeUserLookingForGroup,
    createFakeCampaign
};