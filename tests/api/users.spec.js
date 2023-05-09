const request = require("supertest");
const app = require("../../app");
const { createFakeUser, createFakeUserWithToken, expectNotToBeError, expectToMatchObjectWithDates, expectToBeError } = require("../utils");

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
});