const request = require("supertest");
const { faker } = require("@faker-js/faker");
const app = require("../../app");
const { objectContaining } = expect;
const {
    emptyTables,
    expectToBeError,
    expectNotToBeError,
    createFakeUser,
    createFakeCampaign,
    createFakeUserCampaign,
    createFakeCampaignWithUserCampaigns,
    createFakeCampaignWithUserCampaignsAndMessages,
    createFakeUserWithToken,
    expectToMatchObjectWithDates
} = require("../utils");

describe("/api/campaigns", () => {

    beforeEach(async () => emptyTables());

    describe("GET /api/campaigns", () => {
        it("Returns a list of all campaigns that are looking for players if no user is logged in or logged in user is not an admin", async () => {
            const { token } = await createFakeUserWithToken({ isAdmin: false });
            const numCampaigns = 3;
            for (let i = 0; i < numCampaigns; i++) {
                await createFakeCampaign({ isOpen: true });
            };
            const noLoginResponse = await request(app).get("/api/campaigns");
            const loggedInResponse = await request(app)
                .get("/api/campaigns")
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(noLoginResponse.body);
            expect(noLoginResponse.body.length).toBe(numCampaigns);
            expectNotToBeError(loggedInResponse.body);
            expect(loggedInResponse.body.length).toBe(numCampaigns);
        });

        it("Returns a list of all campaigns if logged in user is an admin", async () => {
            const { token } = await createFakeUserWithToken({ isAdmin: true });
            const numCampaigns = 5;
            for (let i = 0; i < numCampaigns; i++) {
                await createFakeCampaign({ isOpen: false });
            };
            const response = await request(app)
                .get("/api/campaigns")
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expect(response.body.length).toBe(numCampaigns);
        });
    });

    describe("GET /api/campaigns/:campaignId", () => {
        it("Returns the data for the camapign given a specific id", async () => {
            const campaign = await createFakeCampaign({ isOpen: true});
            const response = await request(app).get(`/api/campaigns/${campaign.id}`);
            expectNotToBeError(response.body);
            expect(response.body).toEqual(
                objectContaining({
                    id: campaign.id,
                    creatorId: campaign.creatorId,
                    name: campaign.name
                })
            );
        });

        it("Returns the data for a campaign that is not looking for players if logged in user is in the campaign", async () => {
            const { user, token } = await createFakeUserWithToken({});
            const closedCampaign = await createFakeCampaignWithUserCampaigns({ creatorId: user.id, isOpen: false });
            const response = await request(app)
                .get(`/api/campaigns/${closedCampaign.id}`)
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expect(response.body).toEqual(
                objectContaining({
                    id: closedCampaign.id,
                    creatorId: closedCampaign.creatorId,
                    name: closedCampaign.name
                })
            );
        });

        it("Returns the data for a campaign that is not looking for players if logged in user is NOT in the campaign, but is an admin", async () => {
            const user = await createFakeUser({})
            const { token } = await createFakeUserWithToken({ isAdmin: true });
            const closedCampaign = await createFakeCampaignWithUserCampaigns({ creatorId: user.id, isOpen: false });
            const response = await request(app)
                .get(`/api/campaigns/${closedCampaign.id}`)
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expect(response.body).toEqual(
                objectContaining({
                    id: closedCampaign.id,
                    creatorId: closedCampaign.creatorId,
                    name: closedCampaign.name
                })
            );
        });

        it("Includes list of messages if logged in user is in the campaign", async () => {
            const { user, token } = await createFakeUserWithToken({});
            const campaign = await createFakeCampaignWithUserCampaignsAndMessages({ numUsers: 4, creatorId: user.id });
            const response = await request(app)
                .get(`/api/campaigns/${campaign.id}`)
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expect(response.body.messages).toBeTruthy();
        });

        it("Returns a relevant error if the campaign is not looking for players and no user is logged in or logged in user is not in camapign or an admin", async () => {
            const { token } = await createFakeUserWithToken({});
            const campaign = await createFakeCampaignWithUserCampaigns({ isOpen: false });
            const noLoginResponse = await request(app)
                .get(`/api/campaigns/${campaign.id}`);
            const loggedInResponse = await request(app)
                .get(`/api/campaigns/${campaign.id}`)
                .set("Authorization", `Bearer ${token}`);
            expect(noLoginResponse.status).toBe(403);
            expectToBeError(noLoginResponse.body, 'UnauthorizedUserError');
            expect(loggedInResponse.status).toBe(403);
            expectToBeError(loggedInResponse.body, 'UnauthorizedUserError');
        });
    });

    describe("POST /api/campaigns", () => {
        it("Returns the data for the newly created campaign, with logged in user's id as creatorId", async () => {
            const { user, token } = await createFakeUserWithToken({});
            const fakeCampaignData = {
                name: "Hot Strahd",
                path: "Hot_Strahd",
                location: faker.location.city()
            };
            const response = await request(app)
                .post("/api/campaigns")
                .send(fakeCampaignData)
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expect(response.body).toEqual(
                objectContaining({
                    creatorId: user.id,
                    name: fakeCampaignData.name,
                    location: fakeCampaignData.location
                })
            );
        });

        it("Returns a relevant error if no user is logged in", async () => {
            const fakeCampaignData = {
                name: "The Pirates of Neverwinter",
                location: faker.location.city()
            };
            const response = await request(app)
                .post("/api/campaigns")
                .send(fakeCampaignData)
            expect(response.status).toBe(401);
            expectToBeError(response.body, 'UnauthorizedError');
        });
    });

    describe("PATCH /api/campaigns/:campaignId", () => {
        it("Returns the data of the updated campaign if logged in user is the creator of the campaign", async () => {
            const { user, token } = await createFakeUserWithToken({});
            const campaign = await createFakeCampaign({ creatorId: user.id });
            const newName = "Fake Data: A Fake News Tale";
            const response = await request(app)
                .patch(`/api/campaigns/${campaign.id}`)
                .send({ name: newName })
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expect(response.body.name).toBe(newName);
        });

        it("Returns the data of the updated campaign if logged in user is the DM of the campaign", async () => {
            const { user, token } = await createFakeUserWithToken({});
            const campaign = await createFakeCampaign({});
            await createFakeUserCampaign({
                userId: user.id,
                campaignId: campaign.id,
                isDM: true
            });
            const newName = "James and the Giant Tankard of Ale";
            const response = await request(app)
                .patch(`/api/campaigns/${campaign.id}`)
                .send({ name: newName })
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expect(response.body.name).toBe(newName);
        });

        it("Returns a relevant error if no user is logged in or logged in user is not the creator or DM of the campaign", async () => {
            const { user, token } = await createFakeUserWithToken({});
            const campaign = await createFakeCampaign({});
            await createFakeUserCampaign({
                userId: user.id,
                campaignId: campaign.id,
                isDM: false
            });
            const newName = "This will never be used!";
            const noLoginResponse = await request(app)
                .patch(`/api/campaigns/${campaign.id}`)
                .send({ name: newName })
            const loggedInResponse = await request(app)
                .patch(`/api/campaigns/${campaign.id}`)
                .send({ name: newName })
                .set("Authorization", `Bearer ${token}`);
            expect(noLoginResponse.status).toBe(401);
            expectToBeError(noLoginResponse.body, 'UnauthorizedError');
            expect(loggedInResponse.status).toBe(403);
            expectToBeError(loggedInResponse.body, 'UnauthorizedUpdateError');
        });
    });

    describe("DELETE /api/campaigns/:campaignId", () => {
        it("Returns the data of the deleted campaign if logged in user is the creator of the camapign", async () => {
            const { user, token } = await createFakeUserWithToken({});
            const campaign = await createFakeCampaign({ creatorId: user.id });
            const response = await request(app)
                .delete(`/api/campaigns/${campaign.id}`)
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expectToMatchObjectWithDates(response.body, campaign);
        });

        it("Returns the data of the deleted campaign if logged in user is NOT the creator of the campaign, but is an admin", async () => {
            const { token } = await createFakeUserWithToken({ isAdmin: true });
            const campaign = await createFakeCampaign({});
            const response = await request(app)
                .delete(`/api/campaigns/${campaign.id}`)
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expectToMatchObjectWithDates(response.body, campaign);
        });

        it("Returns a relevant error if no user is logged in, or logged in user is not the creator of the campaign or an admin", async () => {
            const { token } = await createFakeUserWithToken({ isAdmin: false });
            const campaign = await createFakeCampaign({});
            const noLoginResponse = await request(app).delete(`/api/campaigns/${campaign.id}`);
            const loggedInResponse = await request(app)
                .delete(`/api/campaigns/${campaign.id}`)
                .set("Authorization", `Bearer ${token}`);
            expect(noLoginResponse.status).toBe(401);
            expectToBeError(noLoginResponse.body, 'UnauthorizedError');
            expect(loggedInResponse.status).toBe(403);
            expectToBeError(loggedInResponse.body, 'UnauthorizedDeleteError');
        });
    });
});