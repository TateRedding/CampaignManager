const faker = require("faker");
const { createUser } = require("../db/users")

const createFakeUser = async (username = faker.internet.userName()) => {
    {
        const fakeUserData = {
            username,
            password: faker.internet.password(),
            email: faker.internet.email()
        };
        const user = await createUser(fakeUserData);
        if (!user) {
            throw new Error("createUser didn't return a user");
        };
        return user;
    };
};

console.log(createFakeUser("Test"));

module.exports = {
    createFakeUser
};