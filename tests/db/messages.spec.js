const { faker } = require("@faker-js/faker");
const { objectContaining } = expect;
const client = require("../../db/client");
const {
    updateMessage,
    getMessageById,
    deleteMessage,
    getInvitationsAndRequestsByUserId,
    getPrivateMessagesByUserId,
    getPublicMessagesByCampaignId
} = require("../../db/messages");
const {
    createFakeUser,
    createFakeCampaign,
    createFakeMessage,
    createFakeCampaignWithUserCampaignsAndMessages
} = require("../utils");

describe("DB messages", () => {
    describe("createMessage", () => {
        it("Creates and returns the new message", async () => {
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

    describe("getInvitationsAndRequestsByUserId", () => {
        it("Gets a list of all messages that are invitations and the given userId is that of either the message's recipientId", async () => {
            const numInvitations = 5;
            const user = await createFakeUser({});
            for (let i = 0; i < numInvitations; i++) {
                const campaign = await createFakeCampaign({});
                await createFakeMessage({
                    senderId: campaign.creatorId,
                    campaignId: campaign.id,
                    recipientId: user.id,
                    type: 'invitation'
                });
            };
            const messages = await getInvitationsAndRequestsByUserId(user.id);
            expect(messages.length).toBe(numInvitations);
        });

        it("Includes the associated campaign's creatorId aliased as campaignCreatorId", async () => {
            const user = await createFakeUser({});
            const campaign = await createFakeCampaign({});
            await createFakeMessage({
                senderId: campaign.creatorId,
                campaignId: campaign.id,
                recipientId: user.id,
                type: 'invitation'
            });
            const messages = await getInvitationsAndRequestsByUserId(user.id);
            expect(messages[0].campaignCreatorId).toBeTruthy();
            expect(messages[0].campaignCreatorId).toBe(campaign.creatorId);
        });
    });

    describe("getPrivateMessagesByUserId", () => {
        it("Returns an array of objects with key:values that are the other party's userId, username, and avatarURL", async () => {
            const user = await createFakeUser({});
            const otherUser = await createFakeUser({});
            await createFakeMessage({
                senderId: user.id,
                recipientId: otherUser.id,
                type: 'private'
            });
            const messages = await getPrivateMessagesByUserId(user.id);
            expect(messages.length).toBeTruthy();
            expect(messages[0]).toMatchObject({
                userId: otherUser.id,
                username: otherUser.username,
                avatarURL: otherUser.avatarURL
            });
        });

        it("returns an array of messages both to and from the other party within their corresponding object", async () => {
            const numPrivateMessages = 6;
            const user = await createFakeUser({});
            const otherUser = await createFakeUser({});
            for (let i = 0; i < numPrivateMessages; i++) {
                if (i % 2 === 0) {
                    await createFakeMessage({
                        senderId: user.id,
                        recipientId: otherUser.id,
                        type: 'private'
                    });
                } else {
                    await createFakeMessage({
                        senderId: otherUser.id,
                        recipientId: user.id,
                        type: 'private'
                    });
                };
            };
            const threads = await getPrivateMessagesByUserId(user.id);
            expect(threads[0].messages).toBeTruthy();
            expect(threads[0].messages.length).toBe(numPrivateMessages);
        });

        it("Does NOT return any of the users invitations", async () => {
            const numPrivateMessages = 3;
            const numInvitations = 2;
            const user = await createFakeUser({});
            const sender = await createFakeUser({});
            for (let i = 0; i < numPrivateMessages; i++) {
                await createFakeMessage({
                    senderId: sender.id,
                    recipientId: user.id,
                    type: 'private'
                });
            };
            for (let j = 0; j < numInvitations; j++) {
                const campaign = await createFakeCampaign({ creatorId: sender.id});
                await createFakeMessage({
                    senderId: campaign.creatorId,
                    campaignId: campaign.id,
                    recipientId: user.id,
                    type: 'invitation'
                });
            };
            const threads = await getPrivateMessagesByUserId(user.id);
            expect(threads[0].messages.length).toBe(numPrivateMessages);
            expect(threads[0].messages.filter(message => message.isInvitation).length).toBeFalsy();
        });

        it("Does NOT return any messages where the given userId is neither that of the message's senderId or recipientId", async () => {
            const user = await createFakeUser({});
            const unaffiliatedUser = await createFakeUser({});
            const recipient = await createFakeUser({});
            await createFakeMessage({
                senderId: user.id,
                recipientId: recipient.id,
                type: 'private'
            });
            await createFakeMessage({
                senderId: unaffiliatedUser.id,
                recipientId: recipient.id,
                type: 'private'
            });
            const threads = await getPrivateMessagesByUserId(user.id);
            expect(threads.length).toBe(1);
            expect(threads[0].username).not.toBe(unaffiliatedUser.username);
        });
    });

    describe("getPublicMessagesByCampaignId", () => {
        it("Gets a list of all public messages with a given campaignId", async () => {
            const numPublicMessages = 4;
            const campaign = await createFakeCampaignWithUserCampaignsAndMessages({ numUsers: 4, numPublicMessages });
            const messages = await getPublicMessagesByCampaignId(campaign.id);
            expect(messages.length).toBe(numPublicMessages);
        });
    });
});