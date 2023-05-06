const { objectContaining } = expect;
const { updateCampaign } = require("../../db/campaigns");
const { createFakeCampaign } = require("../utils");

describe("DB Campaigns", () => {
    describe("createCampaign", () => {
        it("Creates and returns the new campaign", async () => {
            const name = "Fear and Loathing in The Sword Coast"
            const campaign = await createFakeCampaign({ name });
            expect(campaign).toBeTruthy();
            expect(campaign.name).toBe(name);
        });
    });

    describe("updateCampaign", () => {
        it("Updates and returns updated campaign information", async () => {
            const name = "How to Lose a Gnome in 10 days"
            const campaign = await createFakeCampaign({});
            const updatedCampaign = await updateCampaign(campaign.id, { name });
            expect(updatedCampaign).toEqual(
                objectContaining({
                    id: campaign.id,
                    creatorId: campaign.creatorId,
                    creationDate: campaign.creationDate
                })
            );
            expect(updatedCampaign.name).toBe(name);
        });
    });

    describe("getCampaignById", () => {
        // TODO: Create utils function that creates a campaign with user_campaigns and messages.
        // Probably best to do the tests for user_campaigns and messages before this step.
        it("Gets the campaign with the given id", async () => {

        });

        it("Includes the username of the creator, aliased as creatorName", async () => {

        });

        it("Includes a list of users from the user_campaigns table", async () => {

        });

        it("Includes a list of messages from the messages table", async () => {

        });

    });

    describe("getAllCampaigns", () => {

    });

    describe("getAllPublicCampaigns", () => {

    });

    describe("getCampaignsByUser", () => {

    });
});