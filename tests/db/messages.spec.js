const { faker } = require("@faker-js/faker");
const { objectContaining } = expect;
const client = require("../../db");
const { updateMessage, getMessageById, deleteMessage, getMessagesByCampaignId } = require("../../db/messages");
const { createFakeUser, createFakeCampaign, createFakeMessage, createFakeCampaignWithUserCampaignsAndMessages } = require("../utils");

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
            const content = faker.datatype.string(50);
            const updatedMessage = await updateMessage(message.id, content);
            expect(updatedMessage).toBeTruthy();
            expect(updatedMessage.content).toBe(content);
        });

        it("Only updates the content of the message", async () => {
            const message = await createFakeMessage({});
            const content = faker.datatype.string(50);
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

    describe("getMessagesByCampaignId", () => {
        it("Gets a list of all messages with a given campaignId", async () => {
            const numPublicMessages = 6;
            const numPrivateMessages = 2;
            const campaign = await createFakeCampaignWithUserCampaignsAndMessages(4, numPublicMessages, numPrivateMessages);
            const messages = await getMessagesByCampaignId(campaign.id);
            expect(messages.length).toBe(numPublicMessages + numPrivateMessages);
        });
    });
});