const client = require('./index');
const { createRow } = require('./utils');

const createMessage = async ({ ...fields }) => {
    return await createRow('messages', fields);
};

const updateMessage = async (id, content) => {
    try {
        const { rows: [message] } = await client.query(`
            UPDATE messages
            SET content=${content}
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

const getMessagesByCampaign = async (campaignId) => {
    try {
        const { rows: messages } = await client.query(`
            SELECT *
            FROM messages
            WHERE "campaignId"=${campaignId};
        `);
        return messages;
    } catch (error) {
        console.error(error);
    };
};


module.exports = {
    createMessage,
    updateMessage,
    deleteMessage,
    getMessagesByCampaign
};