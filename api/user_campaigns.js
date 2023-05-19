const express = require('express');
const {
    createUserCampaign,
    getUserCampaignById,
    getUserCampaignByUserIdAndCamapignId
} = require('../db/user_campaigns');
const { getCampaignById } = require('../db/campaigns');
const { requireUser } = require('./utils');
const router = express.Router();

router.post('/', requireUser, async (req, res, next) => {
    const fields = req.body;
    fields.userId = req.user.id;
    try {
        if (fields.campaignId) {
            const _userCampaign = await getUserCampaignByUserIdAndCamapignId(fields.userId, fields.campaignId);
            if (!_userCampaign) {
                const userCampaign = await createUserCampaign(fields);
                res.send(userCampaign);
            } else {
                next({
                    name: 'UserCampaignError',
                    message: 'Could not add user to campaign! User may already be in campaign.'
                });
            };
        }
    } catch ({ name, message }) {
        next({ name, message });
    };
});

router.patch('/:userCampaignId', requireUser, async (req, res, next) => {
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
                name: 'UnauthorizedUpdateError',
                message: `User ${req.user.username} does not have permission to change DM status of user with id ${userCampaign.userId}`
            });
        };
    } catch ({ name, message }) {
        next({ name, message });
    };
});

module.exports = router;