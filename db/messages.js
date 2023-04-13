const client = require('./index');
const { createRow } = require('./utils');

const createMessage = async ({ ...fields }) => {
    return await createRow('messages', fields);
};

const getMessagesByCampaign = async (campaignId) => {
    try {
        const { rows: messages } = await client.query(`
            SELECT *
            FROM messages
            WHERE "campaignId"=${campaignId}
        `);
        return messages;
    } catch (error) {
        console.error(error);
    };
};


module.exports = {
    createMessage,
    getMessagesByCampaign
};