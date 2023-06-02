const { faker } = require("@faker-js/faker");
const { objectContaining } = expect;
const client = require("../../db/client");
const {
    updateMessage,
    getMessageById,
    deleteMessage,
    getMessagesByCampaignIdAndUserId,
    getInvitationsByUserId
} = require("../../db/messages");
const {
    createFakeUser,
    createFakeCampaign,
    createFakeMessage,
    createFakeCampaignWithUserCampaignsAndMessages
} = require("../utils");

describe("DB messages", () => {
    describe("createMessage", () => {
        it("creates and returns the new message", async () => {
            const sender = await createFakeUser({});
            const campaign = await createFakeCampaign({})
            const message = await createFakeMessage({
                senderId: sender.id,
                campaignId: campaign.id
            });
            expect(message).toBeTruthy();
            expect(message).toEqual(
                objectContaining({
                    senderId: sender.id,
                    campaignId: campaign.id
                })
            );
        });
    });

    describe("updateMessage", () => {
        it("Updates and returns the updated message", async () => {
            const message = await createFakeMessage({});
            const content = faker.string.sample(50);
            const updatedMessage = await updateMessage(message.id, content);
            expect(updatedMessage).toBeTruthy();
            expect(updatedMessage.content).toBe(content);
        });

        it("Only updates the content of the message", async () => {
            const message = await createFakeMessage({});
            const content = faker.string.sample(50);
            const updatedMessage = await updateMessage(message.id, content);
            expect(updatedMessage).toEqual(
                objectContaining({
                    id: message.id,
                    senderId: message.senderId,
                    campaignId: message.campaignId
                })
            );
            expect(updatedMessage.content).not.toBe(message.content);
        });
    });

    describe("deleteMessage", () => {
        it("Deletes and returns the deleted message", async () => {
            const message = await createFakeMessage({});
            const deletedMessage = await deleteMessage(message.id);
            expect(deletedMessage).toBeTruthy();
            expect(deletedMessage).toMatchObject(message);
        });

        it("Removes the message entirely from the database", async () => {
            const _message = await createFakeMessage({});
            await deleteMessage(_message.id);
            const { rows: [message] } = await client.query(`
                SELECT *
                FROM messages
                WHERE id=${_message.id};
            `);
            expect(message).toBeFalsy();
        });
    });

    describe("getMessageById", () => {
        it("Gets the message with the given id", async () => {
            const _message = await createFakeMessage({});
            const message = await getMessageById(_message.id);
            expect(message).toMatchObject(_message);
        });
    });

    describe("getInvitationsByUserId", () => {
        it("Gets a list of all messages that are invitations and the given userId is that of either the message's senderId or recipientId", async () => {
            const numInvitations = 3;
            const numRequests = 3;
            const user = await createFakeUser({});
            for (let i = 0; i < numInvitations; i++) {
                const campaign = await createFakeCampaign({});
                await createFakeMessage({   
                    senderId: campaign.creatorId,
                    campaignId: campaign.id,
                    recipientId: user.id,
                    isPublic: false,
                    isInvitation: true
                });
            };
            for (let j = 0; j < numRequests; j++) {
                const campaign = await createFakeCampaign({});
                await createFakeMessage({
                    senderId: user.id,
                    recipientId: campaign.creatorId,
                    campaignId: campaign.id,
                    isPublic: false,
                    isInvitation: true
                });
            };
            const messages = await getInvitationsByUserId(user.id);
            expect(messages.length).toBe(numInvitations + numRequests);
        });
    });

    describe("getMessagesByCampaignIdAndUserId", () => {
        it("Gets a list of all public messages with a given campaignId", async () => {
            const numPublicMessages = 4;
            const campaign = await createFakeCampaignWithUserCampaignsAndMessages({ numUsers: 4, numPublicMessages });
            const messages = await getMessagesByCampaignIdAndUserId(campaign.id, campaign.creatorId);
            expect(messages.length).toBe(numPublicMessages);
        });

        it("Gets the private messages where the given userId is that of the message's senderId", async () => {
            const numPrivateMessages = 10;
            const campaign = await createFakeCampaignWithUserCampaignsAndMessages({
                numUsers: 4,
                numPublicMessages: 0,
                numPrivateMessages
            });
            const messages = await getMessagesByCampaignIdAndUserId(campaign.id, campaign.creatorId);
            expect(messages.length).toBeTruthy();
            expect(messages.filter(message => message.senderId === campaign.creatorId).length).toBeTruthy();
        });

        it("Gets the private messages where the given userId is that of the message's recipientId", async () => {
            const numPrivateMessages = 10;
            const campaign = await createFakeCampaignWithUserCampaignsAndMessages({
                numUsers: 4,
                numPublicMessages: 0,
                numPrivateMessages
            });
            const messages = await getMessagesByCampaignIdAndUserId(campaign.id, campaign.creatorId);
            expect(messages.length).toBeTruthy();
            expect(messages.filter(message => message.recipientId === campaign.creatorId).length).toBeTruthy();
        });

        it("Does NOT return any messages where the given userId is neither that of the message's senderId or recipientId", async () => {
            const numPrivateMessages = 10;
            const campaign = await createFakeCampaignWithUserCampaignsAndMessages({
                numUsers: 4,
                numPublicMessages: 0,
                numPrivateMessages
            });
            const messages = await getMessagesByCampaignIdAndUserId(campaign.id, campaign.creatorId);
            expect(messages.filter(message => {
                return (message.senderId !== campaign.creatorId
                    && message.recipientId !== campaign.creatorId)
            }).length).toBeFalsy();
        });
    });
});