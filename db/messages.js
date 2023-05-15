const client = require('./index');
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

const getMessagesByCampaignIdAndUserId = async (campaignId, userId) => {
    try {
        const { rows: messages } = await client.query(`
            SELECT *
            FROM messages
            WHERE "campaignId"=${campaignId}
            AND "isPublic"=true
            OR ("isPublic"=false
            AND ("senderId"=${userId}
            OR "recipientId"=${userId}));
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
    getMessagesByCampaignIdAndUserId
};