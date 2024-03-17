const { objectContaining } = expect;
const client = require("../../db/client");
const {
    updateUserCampaign,
    deleteUserCampaign,
    getUserCampaignById,
    getUserCampaignsByCampaignId,
    getUserCampaignByUserIdAndCamapignId
} = require("../../db/user_campaigns");
const {
    createFakeUser,
    createFakeCampaign,
    createFakeUserCampaign,
    createFakeCampaignWithUserCampaigns
} = require("../utils");

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

    describe("updateUserCampaign", () => {
        it("Updates and returns the updated user_campaign information", async () => {
            const userCampaign = await createFakeUserCampaign({});
            const updatedUserCampaign = await updateUserCampaign(userCampaign.id, { isDM: true});
            expect(updatedUserCampaign).toBeTruthy();
            expect(updatedUserCampaign).toEqual(
                objectContaining({
                    userId: userCampaign.userId,
                    campaignId: userCampaign.campaignId,
                    isDM: true
                })
            );
        });
    });

    describe("deleteUserCampaign", () => {
        it("Deletes and returns the deleted user_campiagn", async () => {
            const userCampaign = await createFakeUserCampaign({});
            const deletedUserCampaign = await deleteUserCampaign(userCampaign.id);
            expect(deletedUserCampaign).toBeTruthy();
            expect(deletedUserCampaign).toMatchObject(userCampaign);
        });

        it("Removes the user_campaign entirely from the database", async () => {
            const _userCampaign = await createFakeUserCampaign({});
            await deleteUserCampaign(_userCampaign.id);
            const { rows: [userCampaign] } = await client.query(`
                SELECT *
                FROM user_campaigns
                WHERE id=${_userCampaign.id};
            `);
            expect(userCampaign).toBeFalsy();
        });
    });

    describe("getUserCampaignById", () => {
        it("Gets the user_campaign with the given id", async () => {
            const _userCampaign = await createFakeUserCampaign({});
            const userCampaign = await getUserCampaignById(_userCampaign.id);
            expect(userCampaign).toMatchObject(_userCampaign);
        });
    });

    describe("getUserCampaignsByCampaignId", () => {
        it("Gets a list of all user_campaigns with a given campaignId", async () => {
            const numUsers = 4;
            const campaign = await createFakeCampaignWithUserCampaigns({ numUsers });
            const userCampaigns = await getUserCampaignsByCampaignId(campaign.id);
            expect(userCampaigns.length).toBe(numUsers);
        });

        it("Returns the usernames of the users with corresponsing userIds", async () => {
            const campaign = await createFakeCampaignWithUserCampaigns(4);
            const userCampaigns = await getUserCampaignsByCampaignId(campaign.id);
            for (let i = 0; i < userCampaigns.length; i++) {
                expect(userCampaigns[i].username).toBeTruthy();
            };
        });
    });

    describe("getUserCampaignByUserIdAndCamapignId", () => {
        it("Returns the user_campaign with a given userId and campaignId", async () => {
            const user = await createFakeUser({});
            const campaign = await createFakeCampaign({});
            const _userCamapign = await createFakeUserCampaign({
                userId: user.id,
                campaignId: campaign.id
            });
            const userCampaign = await getUserCampaignByUserIdAndCamapignId(user.id, campaign.id);
            expect(userCampaign).toBeTruthy();
            expect(userCampaign).toMatchObject(_userCamapign);
        });
    });
});