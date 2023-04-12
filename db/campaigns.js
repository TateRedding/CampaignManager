const client = require('./index');
const { attachMessagesToCampaigns } = require('./messages');
const { createRow, getRowById } = require('./utils');

const createCampaign = async ({ ...fields }) => {
    return await createRow('campaigns', fields);
};

const getCampaignById = async (id) => {
    try {
        const { rows: [campaign] } = await client.query(`
            SELECT campaigns.*, users.username AS "creatorName"
            FROM campaigns
            JOIN users
                ON campaigns."creatorId"=users.id;
            WHERE campaigns.id=${id}
        `);
        if (campaign) {
            attachMessagesToCampaigns([campaign]);
        };
        return campaign;
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
                ON campaigns."creatorId"=users.id;
        `);
        await attachMessagesToCampaigns(campaigns);
        return campaigns
    } catch (error) {
        console.error(error);
    };
};

const getAllPublicCampaigns = async () => {
    try {
        const allCampaigns = await getAllCampaigns();
        const publicCampaigns = allCampaigns.filter(campaign => campaign.public);
        return publicCampaigns;
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createCampaign,
    getAllPublicCampaigns
};