const request = require("supertest");
const app = require("../../app");
const { faker } = require("@faker-js/faker");
const {
    expectToBeError,
    expectNotToBeError,
    expectToMatchObjectWithDates,
    createFakeUser,
    createFakeUserWithToken,
    createFakeCampaign,
    createFakeMessage,
} = require("../utils");

describe("/api/messages", () => {
    describe("GET /invites/:userId", () => {
        it("Returns the data of the user's invitations", async () => {
            const { user, token } = await createFakeUserWithToken({});
            const numInvitations = 5;
            for (let i = 0; i < numInvitations; i++) {
                const campaign = await createFakeCampaign({});
                await createFakeMessage({
                    senderId: campaign.creatorId,
                    campaignId: campaign.id,
                    recipientId: user.id,
                    isPublic: false,
                    isInvitation: true
                });
            };
            const response = await request(app)
                .get(`/api/messages/invites/${user.id}`)
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expect(response.body.length).toBe(numInvitations);
        });

        it("Returns a relevant error if logged in user's id is not that of the requested userId", async () => {
            const user = await createFakeUser({});
            const { token } = await createFakeUserWithToken({});
            const campaign = await createFakeCampaign({});
            await createFakeMessage({
                senderId: campaign.creatorId,
                campaignId: campaign.id,
                recipientId: user.id,
                isPublic: false,
                isInvitation: true
            });
            const response = await request(app)
                .get(`/api/messages/invites/${user.id}`)
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(403);
            expectToBeError(response.body, "InvitationAccessError");

        });

        it("Returns a relevant error if no user is logged in", async () => {
            const user = await createFakeUser({});
            const campaign = await createFakeCampaign({});
            await createFakeMessage({
                senderId: campaign.creatorId,
                campaignId: campaign.id,
                recipientId: user.id,
                isPublic: false,
                isInvitation: true
            });
            const response = await request(app).get(`/api/messages/invites/${user.id}`)
            expect(response.status).toBe(401);
            expectToBeError(response.body, "UnauthorizedError");

        });
    });

    describe("POST /api/messages", () => {
        it("Returns the data of the newly created message", async () => {
            const { token } = await createFakeUserWithToken({});
            const campaign = await createFakeCampaign({});
            const fakeMessageData = {
                campaignId: campaign.id,
                content: faker.string.sample(100)
            };
            const response = await request(app)
                .post("/api/messages")
                .send(fakeMessageData)
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expect(response.body).toMatchObject(fakeMessageData);
        });

        it("Returns a relevant error if no user is logged in", async () => {
            const campaign = await createFakeCampaign({});
            const fakeMessageData = {
                campaignId: campaign.id,
                content: faker.string.sample(100)
            };
            const response = await request(app)
                .post("/api/messages")
                .send(fakeMessageData);
            expect(response.status).toBe(401);
            expectToBeError(response.body, "UnauthorizedError");
        });
    });

    describe("PATCH /api/messages/:messageId", () => {
        it("Returns the data of the updated message", async () => {
            const { user, token } = await createFakeUserWithToken({});
            const message = await createFakeMessage({ senderId: user.id });
            const newContent = "I'm planning to steal from the rogue's coin pouch!";
            const response = await request(app)
                .patch(`/api/messages/${message.id}`)
                .send({ content: newContent })
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expect(response.body.content).toBe(newContent);
        });

        it("Returns a relevant error if no user is logged in or logged in user is not the sender of the message", async () => {
            const user = await createFakeUser({});
            const { token } = await createFakeUserWithToken({});
            const message = await createFakeMessage({ senderId: user.id });
            const newContent = "Crap! That was supposed to be a private message...";
            const noLoginResponse = await request(app).patch(`/api/messages/${message.id}`);
            const loggedInResponse = await request(app)
                .patch(`/api/messages/${message.id}`)
                .send({ content: newContent })
                .set("Authorization", `Bearer ${token}`);
            expect(noLoginResponse.status).toBe(401);
            expectToBeError(noLoginResponse.body, 'UnauthorizedError');
            expect(loggedInResponse.status).toBe(403);
            expectToBeError(loggedInResponse.body, "UnauthorizedUpdateError");
        });
    });

    describe("DELETE /api/messages/:messageId", () => {
        it("Returns the data of the deleted message if logged in user is the sender of the message", async () => {
            const { user, token } = await createFakeUserWithToken({});
            const message = await createFakeMessage({ senderId: user.id });
            const response = await request(app)
                .delete(`/api/messages/${message.id}`)
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expectToMatchObjectWithDates(response.body, message);
        });

        it("Deletes the message message if logged in user is NOT the sender of the message, but is an admin", async () => {
            const user = await createFakeUser({});
            const { token } = await createFakeUserWithToken({ isAdmin: true });
            const message = await createFakeMessage({ senderId: user.id });
            const response = await request(app)
                .delete(`/api/messages/${message.id}`)
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expectToMatchObjectWithDates(response.body, message);
        });

        it("Deletes the message if logged in user is NOT the sender of the message, but is the creator of the corresponsing campaign", async () => {
            const sender = await createFakeUser({});
            const { user, token } = await createFakeUserWithToken({});
            const campaign = await createFakeCampaign({ creatorId: user.id });
            const message = await createFakeMessage({ senderId: sender.id, campaignId: campaign.id });
            const response = await request(app)
                .delete(`/api/messages/${message.id}`)
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expectToMatchObjectWithDates(response.body, message);
        });

        it("Retruns a relevant error if no user is logged in or logged in user is not the sender of the message, or the creator of the corresponding campaign", async () => {
            const user = await createFakeUser({});
            const { token } = await createFakeUserWithToken({});
            const message = await createFakeMessage({ senderId: user.id });
            const noLoginResponse = await request(app).delete(`/api/messages/${message.id}`);
            const loggedInResponse = await request(app)
                .delete(`/api/messages/${message.id}`)
                .set("Authorization", `Bearer ${token}`);
            expect(noLoginResponse.status).toBe(401);
            expectToBeError(noLoginResponse.body, 'UnauthorizedError');
            expect(loggedInResponse.status).toBe(403);
            expectToBeError(loggedInResponse.body, 'UnauthorizedDeleteError');
        });
    });
});