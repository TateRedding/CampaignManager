const { faker } = require("@faker-js/faker");
const {
    emptyTables,
    expectToBeError,
    expectNotToBeError,
    randInt,
    createFakeUser,
    createFakeUserWithToken,
    createFakeCharacter,
} = require('../utils');
const request = require("supertest");
const app = require("../../app");
const { defaultAbilities, defaultSkills } = require("../../db/characterObjects");

describe("/api/characters", () => {

    beforeEach(async () => emptyTables());

    describe("GET /api/characters", () => {
        it("Returns a list of all characters", async () => {
            const numCharacters = 3;
            for (let i = 0; i < numCharacters; i++) {
                await createFakeCharacter({});
            };
            const response = await request(app)
                .get("/api/characters")
            expectNotToBeError(response.body);
            expect(response.body.length).toBe(numCharacters);
        });
    });

    describe("GET /api/characters/:characterId", () => {
        it("Returns the data for a character with a given id", async () => {
            const character = await createFakeCharacter({});
            const response = await request(app).get(`/api/characters/${character.id}`);
            expectNotToBeError(response.body);
            expect(response.body).toMatchObject(character);
        });
    });

    describe("POST /api/characters", () => {
        it("Returns the data for the newly created character, with logged in user's id as userId", async () => {
            const { user, token } = await createFakeUserWithToken({});
            const fakeCharacterData = {
                userId: user.id,
                name: "Tredd Xenon Li",
                species: faker.word.noun(),
                class: [{ baseClass: faker.word.adjective(), level: 1 }],
                alignment: "chaotic-evil",
                background: `${faker.word.noun()} ${faker.word.adjective()}`,
                age: randInt(350, 18),
                height: randInt(75, 10),
                weight: randInt(250, 100),
                eyes: faker.color.human(),
                hair: faker.color.human(),
                skin: faker.color.human(),
                abilities: defaultAbilities,
                skills: defaultSkills,
                hitDice: [{ dieType: 10, total: 1, remaining: 1 }]
            };
            const response = await request(app)
                .post("/api/characters")
                .send(fakeCharacterData)
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expect(response.body).toMatchObject(fakeCharacterData);
        });

        it("Returns a relevant error if no user is logged in", async () => {
            const user = createFakeUser({});
            const fakeCharacterData = {
                userId: user.id,
                name: "Tredd Xenon Li",
                species: faker.word.noun(),
                class: [{ baseClass: faker.word.adjective(), level: 1 }],
                alignment: "chaotic-evil",
                background: `${faker.word.noun()} ${faker.word.adjective()}`,
                age: randInt(350, 18),
                height: randInt(75, 10),
                weight: randInt(250, 100),
                eyes: faker.color.human(),
                hair: faker.color.human(),
                skin: faker.color.human(),
                abilities: defaultAbilities,
                skills: defaultSkills,
                hitDice: [{ dieType: 10, total: 1, remaining: 1 }]
            };
            const response = await request(app)
                .post("/api/characters")
                .send(fakeCharacterData)
            expect(response.status).toBe(401);
            expectToBeError(response.body, 'UnauthorizedError');
        });
    });

    describe("PATCH /api/characters/:characterId", () => {
        it("Returns the data of the updated character if logged in user is the creator of the character", async () => {
            const { user, token } = await createFakeUserWithToken({});
            const character = await createFakeCharacter({ userId: user.id });
            const newName = "James Gallapagos";
            const response = await request(app)
                .patch(`/api/characters/${character.id}`)
                .send({ name: newName })
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expect(response.body.name).toBe(newName);
        });

        it("Returns a relevant error if no user is logged in or logged in user is not the creator of the character", async () => {
            const { token } = await createFakeUserWithToken({});
            const character = await createFakeCharacter({});
            const newName = "This won't work!";
            const noLoginResponse = await request(app)
                .patch(`/api/characters/${character.id}`)
                .send({ name: newName });
            const loggedInResponse = await request(app)
                .patch(`/api/characters/${character.id}`)
                .send({ name: newName })
                .set("Authorization", `Bearer ${token}`);
            expect(noLoginResponse.status).toBe(401);
            expectToBeError(noLoginResponse.body, 'UnauthorizedError');
            expect(loggedInResponse.status).toBe(403);
            expectToBeError(loggedInResponse.body, 'UnauthorizedUpdateError');
        });
    });

    describe("DELETE /api/characters/:characeterId", () => {
        it("Returns the data of the deleted character if logged in user is the creator of the character", async () => {
            const { user, token } = await createFakeUserWithToken({});
            const character = await createFakeCharacter({ userId: user.id });
            const response = await request(app)
                .delete(`/api/characters/${character.id}`)
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expect(response.body).toMatchObject(character);
        });

        it("Returns a relevant error if no user is logged in or logged in user is not the creator of the character", async () => {
            const { token } = await createFakeUserWithToken({});
            const character = await createFakeCharacter({});
            const noLoginResponse = await request(app).delete(`/api/characters/${character.id}`)
            const loggedInResponse = await request(app)
                .delete(`/api/characters/${character.id}`)
                .set("Authorization", `Bearer ${token}`);
            expect(noLoginResponse.status).toBe(401);
            expectToBeError(noLoginResponse.body, 'UnauthorizedError');
            expect(loggedInResponse.status).toBe(403);
            expectToBeError(loggedInResponse.body, 'UnauthorizedDeleteError');
        });

    });
});