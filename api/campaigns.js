const express = require('express');
const router = express.Router();

const { getAllPublicCampaigns, getCampaignById, getCampaignsByUser } = require('../db/campaigns');
const { getUserByUsername } = require('../db/users');

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

router.get('/user/:username', async (req, res) => {
    try {
        const user = await getUserByUsername(req.params.username);
        const campaigns = await getCampaignsByUser(user);
        res.send(campaigns);
    } catch (error) {
        console.error(error);
    };
});

module.exports = router;