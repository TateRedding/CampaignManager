const { emptyTables } = require('../utils');
const { objectContaining } = expect;
const { getUserCampaignsByCampaignId } = require('../../db/user_campaigns');
const client = require('../../db/client');
const {
    updateCampaign,
    getAllCampaigns,
    getCampaignById,
    getCampaignsLookingForPlayers,
    getCampaignsByUserId,
    getCampaignsLookingForPlayersByUserId,
    deleteCampaign,
} = require("../../db/campaigns");
const {
    createFakeUser,
    createFakeCampaign,
    createFakeCampaignWithUserCampaigns,
    createFakeCampaignWithUserCampaignsAndMessages,
} = require("../utils");

describe("DB campaigns", () => {

    beforeEach(async () => emptyTables());

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

    describe("getAllCampaigns", () => {
        it("Gets a list of all campaigns", async () => {
            const numCampaigns = 5;
            for (let i = 0; i < numCampaigns; i++) {
                await createFakeCampaign({});
            };
            const campaigns = await getAllCampaigns();
            expect(campaigns).toBeTruthy();
            expect(campaigns.length).toBe(numCampaigns);
        });

        it("Includes the usernames of the creators, aliased as creatorName", async () => {
            const numCampaigns = 3;
            for (let i = 0; i < numCampaigns; i++) {
                await createFakeCampaign({});
            };
            const campaigns = await getAllCampaigns();
            for (let j = 0; j < campaigns.length; j++) {
                expect(campaigns[j].creatorName).toBeTruthy();
            };
        });

        it("Includes a list of users from the user_campaigns table", async () => {
            const numUsers = 6;
            const numCampaigns = 3;
            for (let i = 0; i < numCampaigns; i++) {
                await createFakeCampaignWithUserCampaigns({ numUsers });
            };
            const campaigns = await getAllCampaigns();
            for (let j = 0; j < campaigns.length; j++) {
                expect(campaigns[j].users).toBeTruthy();
            };
            expect(campaigns.filter(campaign => campaign.users.length >= numUsers).length).toBe(numCampaigns);
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
            const _campaign = await createFakeCampaignWithUserCampaigns({ numUsers });
            const campaign = await getCampaignById(_campaign.id);
            expect(campaign.users).toBeTruthy();
            expect(campaign.users.length).toBe(numUsers);
        });

        it("Includes a list of messages from the messages table", async () => {
            const numUsers = 4;
            const numPublicMessages = 10;
            const _campaign = await createFakeCampaignWithUserCampaignsAndMessages({ numUsers, numPublicMessages });
            const campaign = await getCampaignById(_campaign.id, _campaign.creatorId);
            expect(campaign.messages).toBeTruthy();
            expect(campaign.messages.length).toBe(numPublicMessages);
        });
    });

    describe("getCampaignsLookingForPlayers", () => {
        it("Gets a list of all campaigns that are looking for players", async () => {
            const numCampaigns = 3;
            for (let i = 0; i < numCampaigns; i++) {
                await createFakeCampaign({ lookingForPlayers: true });
            };
            const campaigns = await getCampaignsLookingForPlayers();
            expect(campaigns).toBeTruthy();
            expect(campaigns.length).toBe(numCampaigns);
        });

        it("Includes the usernames of the creators, aliased as creatorName", async () => {
            const numCampaigns = 3;
            for (let i = 0; i < numCampaigns; i++) {
                await createFakeCampaign({ lookingForPlayers: true });
            };
            const campaigns = await getCampaignsLookingForPlayers();
            for (let j = 0; j < campaigns.length; j++) {
                expect(campaigns[j].creatorName).toBeTruthy();
            };
        });

        it("Includes a list of users from the user_campaigns table", async () => {
            const numUsers = 6;
            const numCampaigns = 3;
            for (let i = 0; i < numCampaigns; i++) {
                await createFakeCampaignWithUserCampaigns({ numUsers, lookingForPlayers: true });
            };
            const campaigns = await getCampaignsLookingForPlayers();
            for (let j = 0; j < campaigns.length; j++) {
                expect(campaigns[j].users).toBeTruthy();
            };
            expect(campaigns.filter(campaign => campaign.users.length >= numUsers).length).toBe(numCampaigns);
        });

        it("Does NOT include campaigns that are not looking for players", async () => {
            const _campaign = await createFakeCampaign({ lookingForPlayers: false });
            const campaigns = await getCampaignsLookingForPlayers();
            expect(campaigns.filter(campaign => campaign.id === _campaign.id).length).toBeFalsy();
        });
    });

    describe("getCampaignsByUserId", () => {
        it("Gets a list of campaigns with a given userId", async () => {
            const numCampaigns = 3;
            const creator = await createFakeUser({});
            for (let i = 0; i < numCampaigns; i++) {
                await createFakeCampaignWithUserCampaigns({
                    numUsers: 1,
                    creatorId: creator.id
                });
            };
            const campaigns = await getCampaignsByUserId(creator.id);
            expect(campaigns).toBeTruthy();
            expect(campaigns.length).toBe(numCampaigns);
        });
    });

    describe("getCampaignsLookingForPlayersByUserId", () => {
        it("Returns a list of campaigns that are looking for players with a given userId", async () => {
            const numCampaigns = 3;
            const creator = await createFakeUser({});
            for (let i = 0; i < numCampaigns; i++) {
                await createFakeCampaignWithUserCampaigns({
                    numUsers: 1,
                    creatorId: creator.id,
                    lookingForPlayers: true
                });
            };
            const campaigns = await getCampaignsLookingForPlayersByUserId(creator.id);
            expect(campaigns).toBeTruthy();
            expect(campaigns.length).toBe(numCampaigns);
        });

        it("Does NOT return any campaigns that are not looking for players", async () => {
            const numOpencampaigns = 3;
            const numClosedCampaigns = 2;
            const creator = await createFakeUser({});
            for (let i = 0; i < numOpencampaigns; i++) {
                await createFakeCampaignWithUserCampaigns({
                    numUsers: 1,
                    creatorId: creator.id,
                    lookingForPlayers: true
                });
            };
            for (let j = 0; j < numClosedCampaigns; j++) {
                await createFakeCampaignWithUserCampaigns({
                    numUsers: 1,
                    creatorId: creator.id,
                    lookingForPlayers: false
                });
            };
            const campaigns = await getCampaignsLookingForPlayersByUserId(creator.id);
            expect(campaigns).toBeTruthy();
            expect(campaigns.length).toBe(numOpencampaigns);
            expect(campaigns.find(campaign => !campaign.lookingForPlayers)).toBeFalsy();

        });
    });

    describe("deleteCampaign", () => {
        it("Returns the data of the deleted campaign", async () => {
            const campaign = await createFakeCampaign({});
            const deletedCampaign = await deleteCampaign(campaign.id);
            expect(deletedCampaign).toBeTruthy();
            expect(deletedCampaign).toMatchObject(campaign);
        });

        it("Completely removes the campaign from the database", async () => {
            const campaign = await createFakeCampaign({});
            await deleteCampaign(campaign.id);
            const deletedCampaign = await getCampaignById(campaign.id);
            expect(deletedCampaign).toBeFalsy();

        });

        it("Deletes any associated user_campaigns", async () => {
            const campaign = await createFakeCampaignWithUserCampaigns({ numUsers: 5 });
            await deleteCampaign(campaign.id);
            const userCampaigns = await getUserCampaignsByCampaignId(campaign.id);
            expect(userCampaigns.length).toBeFalsy();
        });

        it("Deletes any associated messages", async () => {
            const campaign = await createFakeCampaignWithUserCampaignsAndMessages({
                numUsers: 4,
                numPublicMessages: 10
            });
            await deleteCampaign(campaign.id);
            const { rows: messages } = await client.query(`
                SELECT *
                FROM messages
                WHERE "campaignId"=${campaign.id};
            `);
            expect(messages.length).toBeFalsy();
        });
    });
});