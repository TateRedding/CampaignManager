const express = require('express');
const router = express.Router();

const { getAllPublicCampaigns, getCampaignById, createCampaign, updateCampaign } = require('../db/campaigns');
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

router.patch('/:campaignId', requireUser, async (req, res) => {
    const { campaignId } = req.params;
    try {
        const campaign = await getCampaignById(campaignId);
        if (campaign.creatorId === req.user.id) {
            const updatedCampaign = await updateCampaign(campaignId, { ...req.body });
            res.send(updatedCampaign);
        } else {
            res.status(403);
            res.send({
                error: 'UnauthorizedUpdateError',
                message: `User ${req.user.username} does not have permission to edit ${campaign.name}!`
            });
        };
    } catch (error) {
        console.error(error);
    };
});

module.exports = router;