const express = require('express');
const router = express.Router();

const { getAllPublicCampaigns, getCampaignById, getCampaignsByUser, createCampaign } = require('../db/campaigns');
const { getUserById } = require('../db/users');
const { updateRow } = require('../db/utils');
const { requireUser } = require('./utils');

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

router.get('/user/:userId', async (req, res) => {
    try {
        const user = await getUserById(req.params.userId);
        const campaigns = await getCampaignsByUser(user);
        res.send(campaigns);
    } catch (error) {
        console.error(error);
    };
});

router.post('/', requireUser, async (req, res) => {
    const fields = req.body;
    fields.creatorId = req.user.id;
    try {
        const campaign = await createCampaign(fields);
        res.send(campaign);
    } catch (error) {
        console.error(error);
    };
});

router.patch('/:campaignId', async (req, res) => {
    try {
        const updatedCampaign = await updateRow('campaigns', req.params.campaignId, req.body.data);
        res.send(updatedCampaign);
    } catch (error) {
        console.error(error);
    };
});

module.exports = router;