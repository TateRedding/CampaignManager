const express = require('express');
const router = express.Router();
const {
    createCampaign,
    updateCampaign,
    getAllCampaigns,
    getCampaignById,
    getCampaignsLookingForPlayers,
    deleteCampaign,
} = require('../db/campaigns');
const { requireUser } = require('./utils');

router.get('/', async (req, res, next) => {
    try {
        if (req.user && req.user.isAdmin) {
            const campaigns = await getAllCampaigns();
            res.send(campaigns);
        } else {
            const campaigns = await getCampaignsLookingForPlayers();
            res.send(campaigns);
        }
    } catch ({ name, message }) {
        next({ name, message });
    };
});

router.get('/:campaignId', async (req, res, next) => {
    let userId;
    if (req.user) {
        userId = req.user.id;
    };
    try {
        const campaign = await getCampaignById(req.params.campaignId, userId);
        if (campaign.lookingForPlayers ||
            (req.user &&
                (campaign.users.find(user => user.userId === req.user.id) ||
                    req.user.isAdmin))) {
            res.send(campaign);
        } else {
            res.status(403);
            res.send({
                name: 'UnauthorizedUserError',
                message: 'You do not have permission to view this campaign!'
            });
        };
    } catch ({ name, message }) {
        next({ name, message });
    };
});

router.post('/', requireUser, async (req, res, next) => {
    const fields = req.body;
    fields.creatorId = req.user.id;
    try {
        const campaign = await createCampaign(fields);
        res.send(campaign);
    } catch ({ name, message }) {
        next({ name, message });
    };
});

router.patch('/:campaignId', requireUser, async (req, res, next) => {
    const { campaignId } = req.params;
    try {
        const campaign = await getCampaignById(campaignId);
        if (campaign) {
            const userCampaign = campaign.users.find(user => user.userId === req.user.id)
            if (campaign.creatorId === req.user.id || (userCampaign && userCampaign.isDM)) {
                const updatedCampaign = await updateCampaign(campaignId, { ...req.body });
                res.send(updatedCampaign);
            } else {
                res.status(403);
                res.send({
                    name: 'UnauthorizedUpdateError',
                    message: `User ${req.user.username} does not have permission to edit ${campaign.name}!`
                });
            };
        };
    } catch ({ name, message }) {
        next({ name, message });
    };
});

router.delete('/:campaignId', requireUser, async (req, res, next) => {
    const { campaignId } = req.params;
    try {
        const campaign = await getCampaignById(campaignId);
        if (campaign) {
            if (campaign.creatorId === req.user.id || req.user.isAdmin) {
                const deletedCampaign = await deleteCampaign(campaign.id);
                res.send(deletedCampaign);
            } else {
                res.status(403);
                res.send({
                    name: 'UnauthorizedDeleteError',
                    message: `User ${req.user.username} does not have permission to delete ${campaign.name}!`
                });
            }
        }
    } catch ({ name, message }) {
        next({ name, message });
    };
});

module.exports = router;