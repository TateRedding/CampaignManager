const request = require("supertest");
const app = require("../../app");
const { objectContaining } = expect;
const { createFakeCampaign, createFakeCampaignWithUserCampaigns, createFakeCampaignWithUserCampaignsAndMessages } = require("../utils");

describe("/api/campaigns", () => {
    describe("GET /api/campaigns", () => {
        // Returns a list of public and private campaigns if logged in user is an admin
        // Returns a list of all public campaigns if no user is logged in or logged in user is not an admin
        it("Returns a list of all public campaigns", async () => {
            const numCampaigns = 3;
            for (let i = 0; i < numCampaigns; i++) {
                await createFakeCampaign({});
            };
            const response = await request(app).get("/api/campaigns");
            expect(response.body).toBeTruthy();
            expect(response.body.length).toBeGreaterThanOrEqual(numCampaigns);
        });

        // Does NOT return private campaigns if logged in user is not an admin
        it("Does NOT return private campaigns", async () => {
            const numPublicCampaigns = 3;
            for (let i = 0; i < numPublicCampaigns; i++) {
                await createFakeCampaign({ isPublic: true });
            };
            const privateCampaign = await createFakeCampaign({ isPublic: false });
            const response = await request(app).get("/api/campaigns");
            expect(response.body.filter(campaign => campaign.id === privateCampaign.id).length).toBeFalsy();
        });

        it("Returns camapigns with users list from user_campaigns table", async () => {
            await createFakeCampaignWithUserCampaigns({});
            const response = await request(app).get("/api/campaigns");
            expect(response.body[0].users).toBeTruthy();
        });
    });

    describe("GET /api/campaigns/:campaignId", () => {
        it("Returns the data for the camapign given a specific id", async () => {
            const campaign = await createFakeCampaign({});
            const response = await request(app).get(`/api/campaigns/${campaign.id}`);
            expect(response.body).toBeTruthy();
            expect(response.body).toEqual(
                objectContaining({
                    id: campaign.id,
                    creatorId: campaign.creatorId,
                    name: campaign.name
                })
            );
        });

        // Returns the data for a private campaign if logged in user is the creator of the campaign or in the campaign
        // Returns the data for a private campaign if logged in user is NOT the creator of the campaign or in the campaign, but is an admin

        it("Includes a list of users from the user_camapigns table", async () => {
            const numUsers = 4;
            const campaign = await createFakeCampaignWithUserCampaigns({ numUsers });
            const response = await request(app).get(`/api/campaigns/${campaign.id}`);
            expect(response.body.users.length).toBe(numUsers);
        });

        // Includes public messages if user is logged in
        // Does NOT include private messages that are not to or from the logged in user, if logged in user is not an admin
        // Does NOT include any messages if no user is logged in or logged in user is not in campaign with given id and not an admin
        // Returns a relevant error if the campaign is private and no user is logged in or logged in user is not in camapign
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