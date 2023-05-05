const faker = require("faker");
const { createUser } = require("../db/users")

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

module.exports = {
    createFakeUser
};