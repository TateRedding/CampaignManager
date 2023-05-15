const { emptyTables, expectNotToBeError, expectToMatchObjectWithDates, expectToBeError } = require('../utils');
const request = require("supertest");
const app = require("../../app");
const { objectContaining } = expect;
const {
    createFakeUser,
    createFakeCampaign,
    createFakeCampaignWithUserCampaigns,
    createFakeCampaignWithUserCampaignsAndMessages,
    createFakeUserWithToken
} = require("../utils");

describe("/api/campaigns", () => {

    beforeEach(async () => emptyTables());

    describe("GET /api/campaigns", () => {
        it("Returns a list of all public campaigns if no user is logged in or logged in user is not an admin", async () => {
            const { token } = await createFakeUserWithToken({ isAdmin: false });
            const numCampaigns = 3;
            for (let i = 0; i < numCampaigns; i++) {
                await createFakeCampaign({});
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

        it("Returns a list of public and private campaigns if logged in user is an admin", async () => {
            const { token } = await createFakeUserWithToken({ isAdmin: true });
            const numPublicCampaigns = 3;
            for (let i = 0; i < numPublicCampaigns; i++) {
                await createFakeCampaign({ isPublic: true });
            };
            const privateCampaign = await createFakeCampaign({ isPublic: false });
            const response = await request(app)
                .get("/api/campaigns")
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expect(response.body.length).toBe(numPublicCampaigns + 1);
            expect(response.body.filter(campaign => campaign.id === privateCampaign.id).length).toBeTruthy();
        });

        it("Does NOT return private campaigns if no user is logged in or logged in user is not an admin", async () => {
            const { token } = await createFakeUserWithToken({ isAdmin: false });
            const numPublicCampaigns = 3;
            for (let i = 0; i < numPublicCampaigns; i++) {
                await createFakeCampaign({ isPublic: true });
            };
            const privateCampaign = await createFakeCampaign({ isPublic: false });
            const noLoginResponse = await request(app).get("/api/campaigns");
            const loggedInResponse = await request(app)
                .get("/api/campaigns")
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(noLoginResponse.body);
            expect(noLoginResponse.body.filter(campaign => campaign.id === privateCampaign.id).length).toBeFalsy();
            expectNotToBeError(loggedInResponse.body);
            expect(loggedInResponse.body.filter(campaign => campaign.id === privateCampaign.id).length).toBeFalsy();
        });
    });

    describe("GET /api/campaigns/:campaignId", () => {
        it("Returns the data for the camapign given a specific id", async () => {
            const campaign = await createFakeCampaign({});
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

        it("Returns the data for a private campaign if logged in user is in the campaign", async () => {
            const { user, token } = await createFakeUserWithToken({});
            const privateCampaign = await createFakeCampaignWithUserCampaigns({ creatorId: user.id, isPublic: false });
            const response = await request(app)
                .get(`/api/campaigns/${privateCampaign.id}`)
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expect(response.body).toEqual(
                objectContaining({
                    id: privateCampaign.id,
                    creatorId: privateCampaign.creatorId,
                    name: privateCampaign.name
                })
            );
        });

        it("Returns the data for a private campaign if logged in user is NOT in the campaign, but is an admin", async () => {
            const user = await createFakeUser({})
            const { token } = await createFakeUserWithToken({ isAdmin: true });
            const privateCampaign = await createFakeCampaignWithUserCampaigns({ creatorId: user.id, isPublic: false });
            const response = await request(app)
                .get(`/api/campaigns/${privateCampaign.id}`)
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expect(response.body).toEqual(
                objectContaining({
                    id: privateCampaign.id,
                    creatorId: privateCampaign.creatorId,
                    name: privateCampaign.name
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

        it("Returns a relevant error if the campaign is private and no user is logged in or logged in user is not in camapign or an admin", async () => {
            const { user, token } = await createFakeUserWithToken({});
            console.log(user.id);
            const campaign = await createFakeCampaignWithUserCampaigns({ isPublic: false });
            const noLoginResponse = await request(app)
                .get(`/api/campaigns/${campaign.id}`);
            const loggedInResponse = await request(app)
                .get(`/api/campaigns/${campaign.id}`)
                .set("Authorization", `Bearer ${token}`);
            expectToBeError(noLoginResponse.body, 'UnauthorizedUserError');
            expectToBeError(loggedInResponse.body, 'UnauthorizedUserError');
        });
    });

    describe("POST /api/campaigns", () => {
        // Returns the data for the newly created campaign
    });

    describe("PATCH /api/campaigns/:campaignId", () => {
        // Returns the data of the updated camapign
        // Returns a relevant error if no user is logged in
        // Returns a relevant error if logged in user is not the creator or DM of a campaign

    });

    describe("DELETE /api/campaigns/:campaignId", () => {
        // Returns the data of the deleted campaign if logged in user is the creator of the camapign
        // Retruns the data of the deleted campaign if logged in user is NOt the creator of the campaign, but is an admin
        // Returns a relevant error if no user is logged in
        // Returns a relevant error if logged in user is not the creator of the campaign
    });
});