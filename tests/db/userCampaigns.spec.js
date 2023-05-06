const { objectContaining } = expect;
const { createFakeUser, createFakeCampaign, createFakeUserCampaign } = require("../utils");

describe("DB user_campaigns", () => {
    describe("createUserCampaign", () => {
        it("Creates and returns the new user_campaign", async () => {
            const user = await createFakeUser({});
            const campaign = await createFakeCampaign({});
            const userCampaign = await createFakeUserCampaign({
                userId: user.id,
                campaignId: campaign.id
            });
            expect(userCampaign).toBeTruthy();
            expect(userCampaign).toEqual(
                objectContaining({
                    userId: user.id,
                    campaignId: campaign.id
                })
            );
        });
    });
});