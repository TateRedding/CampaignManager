const { objectContaining } = expect;
const { updateCampaign, getCampaignById, getAllPublicCampaigns, getCampaignsByUserId } = require("../../db/campaigns");
const { createFakeCampaignWithUserCampaignsAndMessages } = require("../utils");
const { createFakeCampaignWithUserCampaigns } = require("../utils");
const { createFakeCampaign, createFakeUser } = require("../utils");

describe("DB campaigns", () => {
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
        it("Gets the campaign with the given id", async () => {
            const _campaign = await createFakeCampaign({});
            const campaign = await getCampaignById(_campaign.id);
            expect(campaign).toMatchObject(_campaign);
        });

        it("Includes the username of the creator, aliased as creatorName", async () => {
            const creator = await createFakeUser({});
            const _campaign = await createFakeCampaign({ creatorId: creator.id });
            const campaign = await getCampaignById(_campaign.id);
            expect(campaign.creatorName).toBe(creator.username);
        });

        it("Includes a list of users from the user_campaigns table", async () => {
            const numUsers = 3;
            const _campaign = await createFakeCampaignWithUserCampaigns(numUsers);
            const campaign = await getCampaignById(_campaign.id);
            expect(campaign.users).toBeTruthy();
            expect(campaign.users.length).toBe(numUsers);
        });

        it("Includes a list of messages (public and private) from the messages table", async () => {
            const numUsers = 4;
            const numPublicMessages = 5;
            const numPrivateMessages = 3;
            const _campaign = await createFakeCampaignWithUserCampaignsAndMessages(numUsers, numPublicMessages, numPrivateMessages);
            const campaign = await getCampaignById(_campaign.id);
            expect(campaign.messages).toBeTruthy();
            expect(campaign.messages.length).toBe(numPublicMessages + numPrivateMessages);
            expect(campaign.messages.filter(message => message.isPublic).length).toBe(numPublicMessages);
            expect(campaign.messages.filter(message => !message.isPublic).length).toBe(numPrivateMessages);
        });
    });

    describe("getAllPublicCampaigns", () => {
        it("Gets a list of all public campaigns", async () => {
            const numCampaigns = 3;
            for (let i = 0; i < numCampaigns; i++) {
                await createFakeCampaign({});
            };
            const campaigns = await getAllPublicCampaigns();
            expect(campaigns).toBeTruthy();
            expect(campaigns.length).toBeGreaterThanOrEqual(numCampaigns);
        });

        it("Includes the usernames of the creators, aliased as creatorName", async () => {
            const numCampaigns = 3;
            for (let i = 0; i < numCampaigns; i++) {
                await createFakeCampaign({});
            };
            const campaigns = await getAllPublicCampaigns();
            for (let j = 0; j < campaigns.length; j++) {
                expect(campaigns[j].creatorName).toBeTruthy();
            };
        });

        it("Includes a list of users from the user_campaigns table", async () => {
            const numUsers = 6;
            const numCampaigns = 3;
            for (let i = 0; i < numCampaigns; i++) {
                await createFakeCampaignWithUserCampaigns(numUsers);
            };
            const campaigns = await getAllPublicCampaigns();
            for (let j = 0; j < campaigns.length; j++) {
                expect(campaigns[j].users).toBeTruthy();
            };
            expect(campaigns.filter(campaign => campaign.users.length >= numUsers).length).toBeGreaterThanOrEqual(numCampaigns);
        });

        it("Does NOT include private campaigns", async () => {
            const privateCampaign = await createFakeCampaign({ isPublic: false });
            const campaigns = await getAllPublicCampaigns();
            expect(campaigns.filter(campaign => campaign.id === privateCampaign.id).length).toBeFalsy();
        });

    });

    describe("getCampaignsByUserId", () => {
        it("Gets a list of campaigns with a given userId", async () => {
            const numCampaigns = 3;
            const creator = await createFakeUser({});
            for (let i = 0; i < numCampaigns; i++) {
                await createFakeCampaignWithUserCampaigns(1, creator.id);
            };
            const campaigns = await getCampaignsByUserId(creator.id);
            expect(campaigns).toBeTruthy();
            expect(campaigns.length).toBe(numCampaigns);
        });

        it("Includes a list of users from the user_campaigns table", async () => {
            const numCampaigns = 3;
            const numUsers = 4;
            const creator = await createFakeUser({});
            for (let i = 0; i < numCampaigns; i++) {
                await createFakeCampaignWithUserCampaigns(numUsers, creator.id);
            };
            const campaigns = await getCampaignsByUserId(creator.id);
            for (let j = 0; j < campaigns.length; j++) {
                expect(campaigns[j].users).toBeTruthy();
                expect(campaigns[j].users.length).toBe(numUsers);
            };
        });
    });
});