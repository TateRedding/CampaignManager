const client = require('./client');
const { getPublicMessagesByCampaignId } = require('./messages');
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

const getCampaignById = async (id) => {
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
            campaign.messages = await getPublicMessagesByCampaignId(campaign.id);
        };
        return campaign;
    } catch (error) {
        console.error(error);
    };
};

const getOpenCampaigns = async () => {
    try {
        const { rows: campaigns } = await client.query(`
            SELECT campaigns.*, users.username AS "creatorName"
            FROM campaigns
            JOIN users
                ON campaigns."creatorId"=users.id
            WHERE "isOpen"=true;
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

const getOpenCampaignsByUserId = async (userId) => {
    try {
        const { rows: campaigns } = await client.query(`
            SELECT campaigns.*
            FROM campaigns
            JOIN user_campaigns
                ON user_campaigns."campaignId"=campaigns.id
            WHERE "isOpen"=true
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
    getOpenCampaigns,
    getOpenCampaignsByUserId,
    getCampaignsByUserId,
    deleteCampaign
};