const client = require('./index');
const { createRow } = require('./utils');

const createUserCampaign = async ({ ...fields }) => {
    return await createRow('user_campaigns', fields);
};

const getUserCampaignsByCampaignId = async (id) => {
    try {
        const { rows: userCampaigns } = await client.query(`
            SELECT user_campaigns.id, user_campaigns."userId", users.username AS username, user_campaigns."isDM"
            FROM user_campaigns
            JOIN users
                ON user_campaigns."userId"=users.id
            WHERE "campaignId"=${id};
        `);
        return userCampaigns;
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createUserCampaign,
    getUserCampaignsByCampaignId
};