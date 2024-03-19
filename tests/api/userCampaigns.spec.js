const request = require("supertest");
const app = require("../../app");
const {
    expectToBeError,
    expectNotToBeError,
    createFakeUser,
    createFakeUserWithToken,
    createFakeCampaign,
    createFakeUserCampaign
} = require("../utils");

describe("/api/userCampaigns", () => {
    describe("POST /api/user_campaigns", () => {
        it("Returns the data of the newly created user_campaign", async () => {
            const { user, token } = await createFakeUserWithToken({});
            const campaign = await createFakeCampaign({ creatorId: user.id });
            const fakeUserCampaignData = {
                userId: user.id,
                campaignId: campaign.id,
            };
            const response = await request(app)
                .post("/api/user_campaigns")
                .send(fakeUserCampaignData)
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expect(response.body).toMatchObject(fakeUserCampaignData);
        });

        it("Returns a relevant error if no campaign exists with the given campaign id", async () => {
            const { user, token } = await createFakeUserWithToken({});
            const newestCampaign = await createFakeCampaign({});
            const fakeUserCampaignData = {
                userId: user.id,
                campaignId: newestCampaign.id + 1
            };
            const response = await request(app)
                .post("/api/user_campaigns")
                .send(fakeUserCampaignData)
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(404);
            expectToBeError(response.body, "CampaignNotFoundError");
        });

        it("Returns a relevant error if no user is logged in or logged in user is not the creator or a DM of the corresponding campaign", async () => {
            const user = await createFakeUser({});
            const { token } = await createFakeUserWithToken({});
            const campaign = await createFakeCampaign({ creatorId: user.id });
            const fakeUserCampaignData = {
                userId: user.id,
                campaignId: campaign.id
            };
            const noLoginResponse = await request(app).post('/api/user_campaigns');
            const loggedInResponse = await request(app)
                .post('/api/user_campaigns')
                .send(fakeUserCampaignData)
                .set("Authorization", `Bearer ${token}`);
            expect(noLoginResponse.status).toBe(401);
            expectToBeError(noLoginResponse.body, 'UnauthorizedError');
            expect(loggedInResponse.status).toBe(403);
            expectToBeError(loggedInResponse.body, "UnauthorizedError");
        });

        it("Returns a relevant error if user_campaign with given userId and campaignId already exists", async () => {
            const { user, token } = await createFakeUserWithToken({});
            const campaign = await createFakeCampaign({ creatorId: user.id });
            await createFakeUserCampaign({
                userId: user.id,
                campaignId: campaign.id
            });
            const response = await request(app)
                .post("/api/user_campaigns")
                .send({
                    userId: user.id,
                    campaignId: campaign.id 
                })
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(400);
            expectToBeError(response.body, "UserCampaignError");
        });
    });

    describe("PATCH /api/user_campaigns/:userCampaignId", () => {
        it("Returns the data of the updated userCampaign if logged in user is the creator of the corresponding campaign", async () => {
            const _user = await createFakeUser({});
            const { user, token } = await createFakeUserWithToken({});
            const campaign = await createFakeCampaign({ creatorId: user.id });
            const userCampaign = await createFakeUserCampaign({
                userId: _user.id,
                campaignId: campaign.id
            });
            const response = await request(app)
                .patch(`/api/user_campaigns/${userCampaign.id}`)
                .send({ isDM: true })
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expect(response.body.isDM).toBeTruthy();
        });

        it("Returns the data of the updated userCampaign if logged in user is a DM of the corresponding campaign", async () => {
            const _user = await createFakeUser({});
            const { user, token } = await createFakeUserWithToken({});
            const campaign = await createFakeCampaign({});
            const userCampaign = await createFakeUserCampaign({
                userId: _user.id,
                campaignId: campaign.id
            });
            await createFakeUserCampaign({
                userId: user.id,
                campaignId: campaign.id,
                isDM: true
            });
            const response = await request(app)
                .patch(`/api/user_campaigns/${userCampaign.id}`)
                .send({ isDM: true })
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expect(response.body.isDM).toBeTruthy();
        });

        it("Returns a relevant error if no user is logged in or logged in user is not the creator or a DM of the corresponding campaign", async () => {
            const user = await createFakeUser({});
            const { token } = await createFakeUserWithToken({});
            const campaign = await createFakeCampaign({});
            const userCampaign = await createFakeUserCampaign({
                userId: user.id,
                campaignId: campaign.id
            });
            const noLoginResponse = await request(app).patch(`/api/user_campaigns/${userCampaign.id}`);
            const loggedInResponse = await request(app)
                .patch(`/api/user_campaigns/${userCampaign.id}`)
                .send({ isDM: true })
                .set("Authorization", `Bearer ${token}`);
            expect(noLoginResponse.status).toBe(401);
            expectToBeError(noLoginResponse.body, 'UnauthorizedError');
            expect(loggedInResponse.status).toBe(403);
            expectToBeError(loggedInResponse.body, "UnauthorizedUpdateError");
        });
    });

    describe("DELETE /api/userCampaigns/:userCampaignId", () => {
        it("Returns the data of the deleted userCampaign if logged in user is the corresponding user of the userCampaign", async () => {
            const { user, token } = await createFakeUserWithToken({});
            const campaign = await createFakeCampaign({});
            const userCampaign = await createFakeUserCampaign({
                userId: user.id,
                campaignId: campaign.id
            });
            const response = await request(app)
                .delete(`/api/user_campaigns/${userCampaign.id}`)
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expect(response.body).toMatchObject(userCampaign);
        });

        it("Returns the data of the deleted userCampaign if logged in user is NOT the corresponding user of the userCampaign, but is the creator of the corresponding campaign", async () => {
            const _user = await createFakeUser({});
            const { user, token } = await createFakeUserWithToken({});
            const campaign = await createFakeCampaign({ creatorId: user.id });
            const userCampaign = await createFakeUserCampaign({
                userId: _user.id,
                campaignId: campaign.id
            });
            const response = await request(app)
                .delete(`/api/user_campaigns/${userCampaign.id}`)
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expect(response.body).toMatchObject(userCampaign);
        });

        it("Returns the data of the deleted userCampaign if logged in user is NOT the corresponding user of the userCampaign, but is a DM of the corresponding campaign", async () => {
            const _user = await createFakeUser({});
            const { user, token } = await createFakeUserWithToken({});
            const campaign = await createFakeCampaign({});
            const userCampaign = await createFakeUserCampaign({
                userId: _user.id,
                campaignId: campaign.id
            });
            await createFakeUserCampaign({
                userId: user.id,
                campaignId: campaign.id,
                isDM: true
            });
            const response = await request(app)
                .delete(`/api/user_campaigns/${userCampaign.id}`)
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expect(response.body).toMatchObject(userCampaign);
        });

        it("Returns a relevant error if no user is logged in or logged in user is NOT the corresponding user of the userCampaign, or the creator or a DM of the corresponding campaign", async () => {
            const user = await createFakeUser({});
            const { token } = await createFakeUserWithToken({});
            const campaign = await createFakeCampaign({});
            const userCampaign = await createFakeUserCampaign({
                userId: user.id,
                campaignId: campaign.id
            });
            const noLoginResponse = await request(app).delete(`/api/user_campaigns/${userCampaign.id}`);
            const loggedInResponse = await request(app)
                .delete(`/api/user_campaigns/${userCampaign.id}`)
                .set("Authorization", `Bearer ${token}`);
            expect(noLoginResponse.status).toBe(401);
            expectToBeError(noLoginResponse.body, 'UnauthorizedError');
            expect(loggedInResponse.status).toBe(403);
            expectToBeError(loggedInResponse.body, "UnauthorizedDeleteError");
        });
    });
});