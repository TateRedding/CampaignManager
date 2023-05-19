const request = require("supertest");
const app = require("../../app");
const {
    expectToBeError,
    expectNotToBeError,
    createFakeUserWithToken,
    createFakeCampaign,
    createFakeUserCampaign
} = require("../utils");

describe("/api/userCampaigns", () => {
    describe("POST /api/user_campaigns", () => {
        it("Returns the data of the newly created message", async () => {
            const { token } = await createFakeUserWithToken({});
            const campaign = await createFakeCampaign({});
            const fakeUserCampaignData = {
                campaignId: campaign.id,
            };
            const response = await request(app)
                .post("/api/user_campaigns")
                .send(fakeUserCampaignData)
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expect(response.body).toMatchObject(fakeUserCampaignData);
        });

        it("Returns a relevant error if no user is logged in", async () => {
            const campaign = await createFakeCampaign({});
            const response = await request(app)
                .post("/api/user_campaigns")
                .send({ campaignId: campaign.id });
            expect(response.status).toBe(401);
            expectToBeError(response.body, "UnauthorizedError");
        });

        it("Returns a relevant error if user_campaign with userId and campaignId already exists", async () => {
            const { user, token } = await createFakeUserWithToken({});
            const campaign = await createFakeCampaign({});
            await createFakeUserCampaign({
                userId: user.id,
                campaignId: campaign.id
            });
            const response = await request(app)
                .post("/api/user_campaigns")
                .send({ campaignId: campaign.id })
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(500);
            expectToBeError(response.body, "UserCampaignError");
        });
    });

    describe("PATCH /api/user_campaigns/:userCampaignId", () => {

    });

    describe("DELETE /api/userCampaigns/:userCampaignId", () => {

    });
});