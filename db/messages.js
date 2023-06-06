const client = require('./client');
const { createRow, getRowById } = require('./utils');

const createMessage = async ({ ...fields }) => {
    try {
        return await createRow('messages', fields);
    } catch (error) {
        console.error(error);
    };
};

const updateMessage = async (id, content) => {
    content = content.replaceAll("'", "''");
    try {
        const { rows: [message] } = await client.query(`
            UPDATE messages
            SET content='${content}'
            WHERE id=${id}
            RETURNING *;
        `);
        return message;
    } catch (error) {
        console.error(error);
    };
};

const deleteMessage = async (id) => {
    try {
        const { rows: [message] } = await client.query(`
            DELETE FROM messages
            WHERE id=${id}
            RETURNING *;
        `);
        return message;
    } catch (error) {
        console.error(error);
    };
};

const getMessageById = async (id) => {
    try {
        return await getRowById('messages', id)
    } catch (error) {
        console.error(error);
    };
};

const getInvitationsByUserId = async (userId) => {
    try {
        const { rows: messages } = await client.query(`
            SELECT messages.*, campaigns."creatorId" AS "campaignCreatorId"
            FROM messages
            JOIN campaigns
                ON messages."campaignId"=campaigns.id
            WHERE "isInvitation"=true
            AND "recipientId"=${userId}
        `);
        return messages;
    } catch (error) {
        console.error(error);
    };
};

const getPrivateMessagesByUserId = async (userId) => {
    try {
        const { rows: messages } = await client.query(`
            SELECT messages.*,users.username AS "otherPartyUsername", users."avatarURL" AS "otherPartyAvatarURL"
            FROM messages
            JOIN users
                ON
                    (CASE
                        WHEN messages."senderId"=${userId}
                            THEN messages."recipientId"=users.id
                        ELSE messages."senderId"=users.id
                    END)
            WHERE messages."isPublic"=false
            AND messages."isInvitation"=false
            AND (messages."senderId"=${userId}
                OR messages."recipientId"=${userId});
        `);
        return messages;
    } catch (error) {
        console.error(error);
    };
}

const getPublicMessagesByCampaignId = async (campaignId) => {
    try {
        const { rows: messages } = await client.query(`
            SELECT *
            FROM messages
            WHERE "campaignId"=${campaignId}
            AND "isPublic"=true
        `)
        return messages;
    } catch (error) {
        console.error(error);
    };
};


module.exports = {
    createMessage,
    updateMessage,
    deleteMessage,
    getMessageById,
    getInvitationsByUserId,
    getPrivateMessagesByUserId,
    getPublicMessagesByCampaignId
};