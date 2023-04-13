const client = require('./index');
const { getMessagesByCampaign } = require('./messages');
const { getUserCampaignsByCampaignId } = require('./user_campaigns');
const { createRow } = require('./utils');

const createCampaign = async ({ ...fields }) => {
    return await createRow('campaigns', fields);
};

const getCampaignById = async (id) => {
    try {
        const { rows: [campaign] } = await client.query(`
            SELECT campaigns.*, users.username AS "creatorName"
            FROM campaigns
            JOIN users
                ON campaigns."creatorId"=users.id
            WHERE campaigns.id=${id};
        `);
        if (campaign) {
            campaign.players = await getUserCampaignsByCampaignId(campaign.id);
            campaign.messages = await getMessagesByCampaign(campaign.id);
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
        for (let i = 0; i < campaigns.length; i++) {
            if (campaigns[i]) {
                campaigns[i].players = await getUserCampaignsByCampaignId(campaigns[i].id)
            };
        };
        return campaigns;
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
    getCampaignById,
    getAllPublicCampaigns
};