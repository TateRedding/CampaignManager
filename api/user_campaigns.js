const express = require('express');
const {
    createUserCampaign,
    updateUserCampaign,
    getUserCampaignById,
    getUserCampaignByUserIdAndCamapignId,
    deleteUserCampaign,
} = require('../db/user_campaigns');
const { getCampaignById } = require('../db/campaigns');
const { requireUser } = require('./utils');
const router = express.Router();

router.post('/', requireUser, async (req, res, next) => {
    const fields = req.body;
    try {
        const campaign = await getCampaignById(fields.campaignId);
        if (campaign) {
            const loggedInUserPlayerData = campaign.users.filter(player => player.userId === req.user.id)[0];
            if (campaign.creatorId === req.user.id || (loggedInUserPlayerData && loggedInUserPlayerData.isDM)) {
                const _userCampaign = await getUserCampaignByUserIdAndCamapignId(fields.userId, fields.campaignId);
                if (!_userCampaign) {
                    const userCampaign = await createUserCampaign(fields);
                    res.send(userCampaign);
                } else {
                    res.status(400);
                    res.send({
                        name: 'UserCampaignError',
                        message: 'Could not add user to campaign! User may already be in campaign.'
                    });
                };
            } else {
                res.status(403);
                res.send({
                    name: 'UnauthorizedError',
                    message: `User ${req.user.username} does not have permission to add users to campaign with id ${campaign.userId}`
                });
            };
        } else {
            res.status(404);
            res.send({
                name: 'CampaignNotFoundError',
                message: `No campaign could be found with id ${fields.campaignId}`
            });
        };
    } catch ({ name, message }) {
        next({ name, message });
    };
});

router.patch('/:userCampaignId', requireUser, async (req, res, next) => {
    const { userCampaignId } = req.params;
    try {
        const userCampaign = await getUserCampaignById(userCampaignId);
        const campaign = await getCampaignById(userCampaign.campaignId);
        const loggedInUserPlayerData = campaign.users.filter(player => player.userId === req.user.id)[0];
        if (campaign.creatorId === req.user.id || (loggedInUserPlayerData && loggedInUserPlayerData.isDM)) {
            const updatedUserCampaign = await updateUserCampaign(userCampaignId, { ...req.body });
            res.send(updatedUserCampaign);
        } else {
            res.status(403);
            res.send({
                name: 'UnauthorizedUpdateError',
                message: `User ${req.user.username} does not have permission to update user with id ${userCampaign.userId}`
            });
        };
    } catch ({ name, message }) {
        next({ name, message });
    };
});

router.delete('/:userCampaignId', requireUser, async (req, res, next) => {
    const { userCampaignId } = req.params;
    try {
        const userCampaign = await getUserCampaignById(userCampaignId);
        const campaign = await getCampaignById(userCampaign.campaignId);
        const loggedInUserPlayerData = campaign.users.filter(player => player.userId === req.user.id)[0];
        if (userCampaign.userId === req.user.id ||
            campaign.creatorId === req.user.id ||
            (loggedInUserPlayerData && loggedInUserPlayerData.isDM)) {
            const deletedUserCampaign = await deleteUserCampaign(userCampaignId);
            res.send(deletedUserCampaign);
        } else {
            res.status(403);
            res.send({
                name: 'UnauthorizedDeleteError',
                message: `User ${req.user.username} does not have permission remove user with id ${userCampaign.userId} from the campaign ${campaign.name}`
            });
        };
    } catch ({ name, message }) {
        next({ name, message });
    };
})

module.exports = router;