const client = require('./index');
const { getMessagesByCampaignIdAndUserId } = require('./messages');
const { getUserCampaignsByCampaignId } = require('./user_campaigns');
const { createRow, updateRow } = require('./utils');

const createCampaign = async ({ ...fields }) => {
    try {
        return await createRow('campaigns', fields);
    } catch (error) {
        console.error(error);
    };
};

const updateCampaign = async (id, { ...fields }) => {
    try {
        return await updateRow('campaigns', id, fields);
    } catch (error) {
        console.error(error);
    };
};

const getAllCampaigns = async () => {
    try {
        const { rows: campaigns } = await client.query(`
            SELECT campaigns.*, users.username AS "creatorName"
            FROM campaigns
            JOIN users
                ON campaigns."creatorId"=users.id
        `);
        for (let i = 0; i < campaigns.length; i++) {
            if (campaigns[i]) {
                campaigns[i].users = await getUserCampaignsByCampaignId(campaigns[i].id)
            };
        };
        return campaigns;
    } catch (error) {
        console.error(error);
    };
};

const getCampaignById = async (id, userId) => {
    try {
        const { rows: [campaign] } = await client.query(`
            SELECT campaigns.*, users.username AS "creatorName"
            FROM campaigns
            JOIN users
                ON campaigns."creatorId"=users.id
            WHERE campaigns.id='${id}';
        `);
        if (campaign) {
            campaign.users = await getUserCampaignsByCampaignId(campaign.id);
            if(userId && campaign.users.filter(user => user.userId === userId).length) {
                campaign.messages = await getMessagesByCampaignIdAndUserId(campaign.id, userId);
            };
        };
        return campaign;
    } catch (error) {
        console.error(error);
    };
};

const getAllPublicCampaigns = async () => {
    try {
        const { rows: campaigns } = await client.query(`
            SELECT campaigns.*, users.username AS "creatorName"
            FROM campaigns
            JOIN users
                ON campaigns."creatorId"=users.id
            WHERE "isPublic"=true;
        `);
        for (let i = 0; i < campaigns.length; i++) {
            if (campaigns[i]) {
                campaigns[i].users = await getUserCampaignsByCampaignId(campaigns[i].id)
            };
        };
        return campaigns;
    } catch (error) {
        console.error(error);
    };
};

const getPublicCampaignsLookingForPlayers = async () => {
    try {
        const { rows: campaigns } = await client.query(`
            SELECT campaigns.*, users.username AS "creatorName"
            FROM campaigns
            JOIN users
                ON campaigns."creatorId"=users.id
            WHERE "isPublic"=true
            AND "lookingForPlayers"=true;
        `);
        for (let i = 0; i < campaigns.length; i++) {
            if (campaigns[i]) {
                campaigns[i].users = await getUserCampaignsByCampaignId(campaigns[i].id)
            };
        };
        return campaigns;
    } catch (error) {
        console.error(error);
    };
}

const getCampaignsByUserId = async (userId) => {
    try {
        const { rows: campaigns } = await client.query(`
            SELECT campaigns.*
            FROM campaigns
            JOIN user_campaigns
                ON user_campaigns."campaignId"=campaigns.id
            WHERE user_campaigns."userId"=${userId};
        `);
        for (let i = 0; i < campaigns.length; i++) {
            if (campaigns[i]) {
                campaigns[i].users = await getUserCampaignsByCampaignId(campaigns[i].id)
            };
        };
        return campaigns;
    } catch (error) {
        console.error(error);
    };
};

const getPublicCampaignsByUserId = async (userId) => {
    try {
        const { rows: campaigns } = await client.query(`
            SELECT campaigns.*
            FROM campaigns
            JOIN user_campaigns
                ON user_campaigns."campaignId"=campaigns.id
            WHERE campaigns."isPublic"=true
            AND user_campaigns."userId"=${userId};
        `);
        for (let i = 0; i < campaigns.length; i++) {
            if (campaigns[i]) {
                campaigns[i].users = await getUserCampaignsByCampaignId(campaigns[i].id)
            };
        };
        return campaigns;
    } catch (error) {
        console.error(error);
    };
};

const deleteCampaign = async (id) => {
    try {
        const campaign = await getCampaignById(id);
        if (campaign) {
            await client.query(`
                DELETE FROM user_campaigns
                WHERE "campaignId"=${id};
            `);
            await client.query(`
                DELETE FROM messages
                WHERE "campaignId"=${id};
            `);
            const { rows: [deletedCampaign] } = await client.query(`
                DELETE FROM campaigns
                WHERE id=${id}
                RETURNING *;
            `);
            return deletedCampaign;
        };
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createCampaign,
    updateCampaign,
    getAllCampaigns,
    getCampaignById,
    getAllPublicCampaigns,
    getPublicCampaignsLookingForPlayers,
    getCampaignsByUserId,
    getPublicCampaignsByUserId,
    deleteCampaign
};