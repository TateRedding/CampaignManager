const { createFakeCampaign } = require("../utils");

describe("DB Campaigns", () => {
    describe("createCampaign", () => {
        it("Creates and returns the new campaign", async () => {
            const name = "Fear and Loathing in The Sword Coast"
            const campaign = await createFakeCampaign(name);
            expect(campaign).toBeTruthy();
            expect(campaign.name).toBe(name);
        });
    });

    describe("updateCampaign", () => {

    });

    describe("getCampaignById", () => {

    });

    describe("getAllCampaigns", () => {

    });

    describe("getAllPublicCampaigns", () => {

    });

    describe("getCampaignsByUser", () => {

    });
});