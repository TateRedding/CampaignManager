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
        if (campaign.isPublic || (req.user && campaign.players.filter(player => player.id === req.user.id))) {
            res.send(campaign);
        } else {
            res.send({
                error: 'UnauthorizedUserError',
                message: 'You do not have permission to view this campaign!'
            })
        }
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

// needs requireUser and validation
router.patch('/:campaignId', async (req, res) => {
    try {
        const updatedCampaign = await updateRow('campaigns', req.params.campaignId, req.body.data);
        res.send(updatedCampaign);
    } catch (error) {
        console.error(error);
    };
});

module.exports = router;