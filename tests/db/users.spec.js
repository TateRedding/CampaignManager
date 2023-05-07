const client = require("../../db");
const { faker } = require("@faker-js/faker");
const { objectContaining } = expect;
const { updateUser, getUser, getUserById, getUserByUsername, getUsersLookingForGroup } = require("../../db/users");
const { createFakeUser, createFakeUserLookingForGroup } = require("../utils");

describe("DB Users", () => {
    describe("createUser", () => {
        it("Creates and returns the new user", async () => {
            const username = "Lawrence"
            const user = await createFakeUser({ username });
            expect(user.username).toBe(username);
        });

        it("Does NOT return the password", async () => {
            const user = await createFakeUser({});
            expect(user.password).toBeFalsy();
        });

        it("Encrypts password before storing it in the database", async () => {
            const fakeUserData = {
                password: "plainpassword"
            }
            const user = await createFakeUser({ fakeUserData });
            const queriedUser = await client.query(`
                SELECT *
                FROM users
                WHERE id = $1
            `, [user.id]);
            expect(queriedUser.password).not.toBe(fakeUserData.password);
        });
    });

    describe("updateUser", () => {
        it("Updates and returns updated user information", async () => {
            const user = await createFakeUser({});
            const username = "Theodore"
            const updatedUser = await updateUser(user.id, { username });
            expect(updatedUser).toEqual(
                objectContaining({
                    id: user.id,
                    email: user.email,
                    registerDate: user.registerDate
                })
            );
            expect(updatedUser.username).toBe(username);
        });

        it("Does NOT return the password", async () => {
            const user = await createFakeUser({});
            const updatedUser = await updateUser(user.id, { username: "Leopold" });
            expect(updatedUser.password).toBeFalsy();
        });
    });

    describe("getUser", () => {
        it("Returns user data if password verifies", async () => {
            const fakeUserData = {
                username: "Nina",
                password: faker.internet.password()
            };
            await createFakeUser(fakeUserData);
            const user = await getUser(fakeUserData);
            expect(user).toBeTruthy();
            expect(user.username).toBe(fakeUserData.username);
        });

        it("Does NOT return the user data if the password does not verify", async () => {
            const fakeUserData = {
                username: "Vader",
                password: faker.internet.password()
            };
            await createFakeUser(fakeUserData);
            const user = await getUser({
                username: fakeUserData.username,
                password: 'wrongpassword'
            });
            expect(user).toBeFalsy();
        });

        it("Does NOT return the password", async () => {
            const fakeUserData = {
                username: faker.internet.userName(),
                password: faker.internet.password()
            }
            await createFakeUser(fakeUserData);
            const user = await getUser({
                username: fakeUserData.username,
                password: fakeUserData.password
            });
            expect(user.password).toBeFalsy();
        });
    });

    describe("getUserById", () => {
        it("Gets the user with the given id", async () => {
            const _user = await createFakeUser({});
            const user = await getUserById(_user.id);
            expect(user).toMatchObject(user);
        });

        it("Does NOT return the password", async () => {
            const _user = await createFakeUser({})
            const user = await getUserById(_user.id);
            expect(user.password).toBeFalsy();
        });
    });

    describe("getUserByUsername", () => {
        it("Gets the user with the given username", async () => {
            const _user = await createFakeUser({});
            const user = await getUserByUsername(_user.username);
            expect(user).toMatchObject(_user);
        });

        it("Does NOT return the password", async () => {
            const _user = await createFakeUser({})
            const user = await getUserByUsername(_user.username);
            expect(user.password).toBeFalsy();
        });

    });

    describe("getUsersLookingForGroup", () => {
        it("Returns a list of all users who are looking for a group", async () => {
            for (let i = 0; i < 3; i++) {
                await createFakeUserLookingForGroup();
            };
            const users = await getUsersLookingForGroup();
            expect(users.length).toBe(3);
            for (let j = 0; j < users.length; j++) {
                expect(users[j].lookingForGroup).toBeTruthy();
            };
        });

        it("Does NOT return any passwords", async () => {
            for (let i = 0; i < 3; i++) {
                await createFakeUserLookingForGroup();
            };
            const users = await getUsersLookingForGroup();
            for (let j = 0; j < users.length; j++) {
                expect(users[j].password).toBeFalsy();
            };
        });
    });
});
