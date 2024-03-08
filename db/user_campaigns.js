const client = require('./client');
const { createRow, getRowById } = require('./utils');

const createUserCampaign = async ({ ...fields }) => {
    try {
        return await createRow('user_campaigns', fields);
    } catch (error) {
        console.error(error);
    };
};

const updateUserCampaign = async (id, isDM) => {
    try {
        const { rows: [userCampaign] } = await client.query(`
            UPDATE user_campaigns
            SET "isDM"=${isDM}
            WHERE id=${id}
            RETURNING *;
        `);
        return userCampaign;
    } catch (error) {
        console.error(error);
    };
};

const deleteUserCampaign = async (id) => {
    try {
        const { rows: [userCampaign] } = await client.query(`
            DELETE FROM user_campaigns
            WHERE id=${id}
            RETURNING *;
        `);
        return userCampaign;
    } catch (error) {
        console.error(error);
    };
};

const getUserCampaignById = async (id) => {
    try {
        return getRowById('user_campaigns', id);
    } catch (error) {
        console.error(error);
    };
};

const getUserCampaignsByCampaignId = async (campaignId) => {
    try {
        const { rows: userCampaigns } = await client.query(`
            SELECT user_campaigns.id, user_campaigns."userId", users.username AS username, user_campaigns."isDM", user_campaigns."canEdit"
            FROM user_campaigns
            JOIN users
                ON user_campaigns."userId"=users.id
            WHERE "campaignId"=${campaignId};
        `);
        return userCampaigns;
    } catch (error) {
        console.error(error);
    };
};

const getUserCampaignByUserIdAndCamapignId = async (userId, campaignId) => {
    try {
        const { rows: [userCampaign] } = await client.query(`
            SELECT *
            FROM user_campaigns
            WHERE "userId"=${userId}
            AND "campaignId"=${campaignId};
        `);
        return userCampaign;
    } catch (error) {
        console.error(error);
    };
}

module.exports = {
    createUserCampaign,
    updateUserCampaign,
    deleteUserCampaign,
    getUserCampaignById,
    getUserCampaignsByCampaignId,
    getUserCampaignByUserIdAndCamapignId
};