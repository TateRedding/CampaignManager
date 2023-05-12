const request = require("supertest");
const client = require("../../db");
const bcrypt = require('bcrypt');
const { faker } = require("@faker-js/faker");
const { objectContaining } = expect;
const jwt = require("jsonwebtoken");
require('dotenv').config();
const { JWTS } = process.env;
const app = require("../../app");
const {
    expectToBeError,
    expectNotToBeError,
    expectToMatchObjectWithDates,
    createFakeUser,
    createFakeUserWithToken,
    createFakeCharacter
} = require("../utils");
const { createFakeCampaignWithUserCampaigns } = require("../utils");

describe("/api/users", () => {
    describe("GET /api/users", () => {
        it("Returns a list of all users with lookingForGroup set to true", async () => {
            const numUsers = 3;
            for (let i = 0; i < numUsers; i++) {
                await createFakeUser({ lookingForGroup: true });
            }
            const response = await request(app).get("/api/users");
            expectNotToBeError(response.body);
            expect(response.body.length).toBeGreaterThanOrEqual(numUsers);
        });

        it("Does NOT return any users that are not looking for a group", async () => {
            const _user = await createFakeUser({});
            const response = await request(app).get("/api/users");
            expectNotToBeError(response.body);
            expect(response.body.filter(user => user.id === _user.id).length).toBeFalsy();
        });
    });

    describe("GET /api/users/me", () => {
        it("Sends back the data of the user whos token is given in the header", async () => {
            const { user, token } = await createFakeUserWithToken({});
            const response = await request(app)
                .get("/api/users/me")
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expectToMatchObjectWithDates(response.body, user);
        });

        it("Rejects requests without a valid token", async () => {
            const response = await request(app).get("/api/users/me");
            expect(response.status).toBe(401);
            expectToBeError(response.body, 'UnauthorizedError');
        });
    });

    describe("GET /api/users/id/:userId", () => {
        it("Sends back the data of the user with the given userId", async () => {
            const user = await createFakeUser({});
            const response = await request(app).get(`/api/users/id/${user.id}`);
            expectToMatchObjectWithDates(response.body, user);
        });

        it("Returns a relevant error if no user is found", async () => {
            const response = await request(app).get('/api/users/id/1000000');
            expect(response.status).toBe(500);
            expectToBeError(response.body, 'InvalidUserId');
        });
    });

    describe("GET /api/users/username/:username", () => {
        it("Sends back the data of the user with the given username", async () => {
            const user = await createFakeUser({});
            const response = await request(app).get(`/api/users/username/${user.username}`);
            expectToMatchObjectWithDates(response.body, user);
        });

        it("Returns a relevant error if no user is found", async () => {
            const response = await request(app).get('/api/users/username/Jeffers');
            expect(response.status).toBe(500);
            expectToBeError(response.body, 'InvalidUsername');
        });
    });

    describe("GET /api/users/:username/camapigns", () => {
        it("Returns a list of public and private campaigns if username provided is that of the logged in user", async () => {
            const numPublicCampaigns = 3;
            const numPrivateCampaigns = 2;
            const { user, token } = await createFakeUserWithToken({});
            for (let i = 0; i < numPublicCampaigns; i++) {
                await createFakeCampaignWithUserCampaigns({ numUsers: 1, creatorId: user.id, isPublic: true });
            };
            for (let j = 0; j < numPrivateCampaigns; j++) {
                await createFakeCampaignWithUserCampaigns({ numUsers: 1, creatorId: user.id, isPublic: false });
            };
            const response = await request(app)
                .get(`/api/users/${user.username}/campaigns`)
                .set("Authorization", `Bearer ${token}`);
            expect(response.body.length).toBe(numPublicCampaigns + numPrivateCampaigns);
        });

        it("Returns a list of public campaigns if username provided is not that of the logged in user, or no user is logged in", async () => {
            const numCampaigns = 3;
            const user = await createFakeUser({});
            const { token } = await createFakeUserWithToken({});
            for (let i = 0; i < numCampaigns; i++) {
                await createFakeCampaignWithUserCampaigns({ creatorId: user.id });
            };
            const noLoginResponse = await request(app).get(`/api/users/${user.username}/campaigns`);
            const loggedInResponse = await request(app)
                .get(`/api/users/${user.username}/campaigns`)
                .set("Authorization", `Bearer ${token}`);
            expect(noLoginResponse.body.length).toBe(numCampaigns);
            expect(loggedInResponse.body.length).toBe(numCampaigns);
        });

        // Returns a list of public and private characters is logged in user is an admin

        it("Does NOT return private campaigns if username provided is not that of the logged in user, or no user is logged in", async () => {
            const numPublicCampaigns = 3;
            const user = await createFakeUser({});
            const { token } = await createFakeUserWithToken({});
            for (let i = 0; i < numPublicCampaigns; i++) {
                await createFakeCampaignWithUserCampaigns({ numUsers: 1, creatorId: user.id, isPublic: true });
            };
            const privateCampaign = await createFakeCampaignWithUserCampaigns({ numUsers: 1, creatorId: user.id, isPublic: false })
            const noLoginResponse = await request(app).get(`/api/users/${user.username}/campaigns`);
            const loggedInResponse = await request(app)
                .get(`/api/users/${user.username}/campaigns`)
                .set("Authorization", `Bearer ${token}`);
            expect(noLoginResponse.body.filter(campaign => campaign.id === privateCampaign.id).length).toBeFalsy();
            expect(loggedInResponse.body.filter(campaign => campaign.id === privateCampaign.id).length).toBeFalsy();
        });
    });

    describe("GET /api/users/:username/characters", () => {
        it("Returns a list of public and private characters if username provided is that of the logged in user", async () => {
            const numPublicCharacters = 3;
            const numPrivateCharacters = 2;
            const { user, token } = await createFakeUserWithToken({});
            for (let i = 0; i < numPublicCharacters; i++) {
                await createFakeCharacter({ userId: user.id, isPublic: true });
            };
            for (let j = 0; j < numPrivateCharacters; j++) {
                await createFakeCharacter({ userId: user.id, isPublic: false });
            };
            const response = await request(app)
                .get(`/api/users/${user.username}/characters`)
                .set("Authorization", `Bearer ${token}`);
            expect(response.body.length).toBe(numPublicCharacters + numPrivateCharacters);
        });

        // Returns a list of public and private characters is logged in user is an admin

        it("Returns a list of public characters if username provided is not that of the logged in user, or no user is logged in", async () => {
            const numCharacters = 3;
            const user = await createFakeUser({});
            const { token } = await createFakeUserWithToken({});
            for (let i = 0; i < numCharacters; i++) {
                await createFakeCharacter({ userId: user.id });
            };
            const noLoginResponse = await request(app).get(`/api/users/${user.username}/characters`);
            const loggedInResponse = await request(app)
                .get(`/api/users/${user.username}/characters`)
                .set("Authorization", `Bearer ${token}`);
            expect(noLoginResponse.body.length).toBe(numCharacters);
            expect(loggedInResponse.body.length).toBe(numCharacters);
        });

        it("Does NOT return private characters if username provided is not that of the logged in user, or no user is logged in", async () => {
            const numPublicCharacters = 3;
            const user = await createFakeUser({});
            const { token } = await createFakeUserWithToken({});
            for (let i = 0; i < numPublicCharacters; i++) {
                await createFakeCharacter({ userId: user.id, isPublic: true });
            };
            const privateCharacter = await createFakeCharacter({ userId: user.id, isPublic: false })
            const noLoginResponse = await request(app).get(`/api/users/${user.username}/characters`);
            const loggedInResponse = await request(app)
                .get(`/api/users/${user.username}/characters`)
                .set("Authorization", `Bearer ${token}`);
            expect(noLoginResponse.body.filter(character => character.id === privateCharacter.id).length).toBeFalsy();
            expect(loggedInResponse.body.filter(character => character.id === privateCharacter.id).length).toBeFalsy();
        });

    });

    describe("POST /api/users/login", () => {
        it("Logs in the user with given username and password, and verifies that hashed login password matches the saved hashed password.", async () => {
            const fakeUserData = {
                username: faker.internet.userName(),
                password: faker.internet.password()
            };
            await createFakeUser(fakeUserData);
            const response = await request(app)
                .post("/api/users/login")
                .send(fakeUserData);
            expectNotToBeError(response.body);
            expect(response.body).toEqual(
                objectContaining({
                    message: 'Login succesful!'
                })
            );
        });

        it("Returns the logged in user's data", async () => {
            const fakeUserData = {
                username: faker.internet.userName(),
                password: faker.internet.password()
            };
            const user = await createFakeUser(fakeUserData);
            const response = await request(app)
                .post("/api/users/login")
                .send(fakeUserData);
            expectNotToBeError(response.body);
            expectToMatchObjectWithDates(response.body.user, user);
        });

        it("Returns a JWT storing the user's id and username in the token.", async () => {
            const fakeUserData = {
                username: faker.internet.userName(),
                password: faker.internet.password()
            };
            const user = await createFakeUser(fakeUserData);
            const response = await request(app)
                .post("/api/users/login")
                .send(fakeUserData);
            expectNotToBeError(response.body);
            expect(response.body).toMatchObject({
                token: expect.any(String),
            });
            const parsedToken = jwt.verify(response.body.token, JWTS);
            expect(parsedToken).toMatchObject({ id: user.id, username: user.username });
        });

        it("Returns a relevant error if username and password do not match", async () => {
            const fakeUserData = {
                username: faker.internet.userName(),
                password: faker.internet.password()
            };
            const user = await createFakeUser(fakeUserData);
            const response = await request(app)
                .post("/api/users/login")
                .send({
                    username: fakeUserData.username,
                    password: "wrongpassword"
                });
            expect(response.status).toBe(401);
            expectToBeError(response.body, "IncorrectCredentialsError");
        });
    });

    describe("POST /api/users/register", () => {
        it("Creates a new user", async () => {
            const fakeUserData = {
                username: faker.internet.userName(),
                password: faker.internet.password(),
                email: faker.internet.email()
            };
            const response = await request(app)
                .post("/api/users/register")
                .send(fakeUserData);
            expectNotToBeError(response.body);
            expect(response.body).toMatchObject({
                token: expect.any(String),
                user: {
                    id: expect.any(Number),
                    username: fakeUserData.username,
                },
            });
        });

        it("Encypts the password before storing it in the database", async () => {
            const fakeUserData = {
                username: faker.internet.userName(),
                password: faker.internet.password(),
                email: faker.internet.email()
            };
            const response = await request(app)
                .post("/api/users/register")
                .send(fakeUserData);
            expectNotToBeError(response.body);
            const { rows: [user] } = await client.query(
                `
                  SELECT *
                  FROM users
                  WHERE id = ${response.body.user.id};
                `
            );
            const hashedPassword = user.password;
            expect(fakeUserData.password).not.toBe(hashedPassword);
            expect(await bcrypt.compare(fakeUserData.password, hashedPassword)).toBe(
                true
            );
        });

        it("Returns a relevant error if user enters an existing username", async () => {
            const firstUser = await createFakeUser({});
            const secondUserData = {
                username: firstUser.username,
                password: faker.internet.password(),
                email: faker.internet.email()
            };
            const response = await request(app)
                .post("/api/users/register")
                .send(secondUserData);
            expect(response.status).toBe(500);
            expectToBeError(response.body, "UsernameTakenError");
        });

        it("Returns a relevant error if password is less than 8 characters", async () => {
            const fakeUserData = {
                username: faker.internet.userName(),
                password: "2short",
                email: faker.internet.email()
            };
            const response = await request(app)
                .post("/api/users/register")
                .send(fakeUserData);
            expect(response.status).toBe(500);
            expectToBeError(response.body, "PasswordTooShortError");
        });
    });

    describe("PATCH /api/users/:userId", () => {
        it("Updates and returns the updated user data", async () => {
            const newData = {
                firstName: "Fake",
                surname: "User"
            };
            const { user, token } = await createFakeUserWithToken({});
            const response = await request(app)
                .patch(`/api/users/${user.id}`)
                .send(newData)
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expect(response.body.firstName).toBe(newData.firstName);
            expect(response.body.surname).toBe(newData.surname);

        });

        it("Requires the user to be logged in", async () => {
            const newData = {
                firstName: "Fake",
                surname: "User"
            };
            const user = await createFakeUser({});
            const response = await request(app)
                .patch(`/api/users/${user.id}`)
                .send(newData);
            expect(response.status).toBe(401);
            expectToBeError(response.body, "UnauthorizedError")
        });

        it("Returns a relevant error if logged in user is trying to update a different user's data", async () => {
            const newData = {
                firstName: "Fake",
                surname: "User"
            };
            const user = await createFakeUser({});
            const { token } = await createFakeUserWithToken({});
            const response = await request(app)
                .patch(`/api/users/${user.id}`)
                .send(newData)
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(403);
            expectToBeError(response.body, "UnauthorizedUpdateError");
        });
    });

    describe("DELETE /api/users/:userId", () => {
        it("Returns the data of the deactivated user", async () => {
            const { user, token } = await createFakeUserWithToken({});
            const response = await request(app)
                .delete(`/api/users/${user.id}`)
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expect(response.body.isActive).toBeFalsy();
            expect(response.body.deactivationDate).toBeTruthy();
        });

        it("Returns a relevant error if logged in user is trying to deactivate a different user's account", async () => {
            const user = await createFakeUser({});
            const { token } = await createFakeUserWithToken({});
            const response = await request(app)
                .delete(`/api/users/${user.id}`)
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(403);
            expectToBeError(response.body, "UnauthorizedDeleteError");
        });

        it("Allows an admin to deactivate any account", async () => {
            const { token } = await createFakeUserWithToken({ isAdmin: true });
            const user = await createFakeUser({});
            const response = await request(app)
                .delete(`/api/users/${user.id}`)
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expect(response.body.isActive).toBeFalsy();
            expect(response.body.deactivationDate).toBeTruthy();
        });
    });
});