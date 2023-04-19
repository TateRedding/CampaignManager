const express = require('express');
const { createUserCampaign, getUserCampaignById } = require('../db/user_campaigns');
const { getCampaignById } = require('../db/campaigns');
const { requireUser } = require('./utils');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const userCampaign = await createUserCampaign(req.body);
        if (userCampaign) {
            res.send(userCampaign);
        } else {
            res.send({
                error: 'UserCampaignError',
                message: 'Could not add user to campaign! Are they already in it?'
            });
        };
    } catch (error) {
        console.error(error);
    };
});

router.patch('/:userCampaignId', requireUser, async (req, res) => {
    const { userCampaignId } = req.params;
    const { isDM } = req.body;
    try {
        const userCampaign = await getUserCampaignById(userCampaignId);
        const campaign = await getCampaignById(userCampaign.campaignId);
        const loggedInUserPlayerData = campaign.players.filter(player => player.userId === req.user.id)[0];
        if (campaign.creatorId === req.user.id || (loggedInUserPlayerData && loggedInUserPlayerData.isDM)) {
            const updatedUserCampaign = await updateMessage(userCampaignId, isDM);
            res.send(updatedUserCampaign);
        } else {
            res.status(403);
            res.send({
                error: 'UnauthorizedUpdateError',
                message: `User ${req.user.username} does not have permission to change DM status of user with id ${userCampaign.userId}`
            });
        };
    } catch (error) {
        console.error(error);
    };
});

module.exports = router;