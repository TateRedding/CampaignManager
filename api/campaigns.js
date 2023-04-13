const express = require('express');
const router = express.Router();

const { getAllPublicCampaigns, getCampaignById } = require('../db/campaigns');

router.get('/', async (req, res) => {
    try {
        const campaigns = await getAllPublicCampaigns();
        res.send(campaigns);
    } catch (error) {
        console.error(error);
    };
});

router.get('/:campaignId', async (req, res) => {
    try {
        const campaign = await getCampaignById(req.params.campaignId);
        res.send(campaign);
    } catch (error) {
        console.error(error);
    };
});

module.exports = router;