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

const attachMessagesToCampaigns = async (campaigns) => {
    try {
        for (let i = 0; i < campaigns.length; i++) {
            const messages = await getMessagesByCampaign(campaigns[i].id);
            campaigns[i].messages = messages;
        };
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createMessage,
    attachMessagesToCampaigns
};