const express = require('express');
const {
    createPage,
    updatePage,
    deletePage,
    getPageByNameAndCampaignIdAndParentPageId,
} = require('../db/pages');
const { requireUser } = require('./utils');
const router = express.Router();

router.post('/', requireUser, async (req, res, next) => {
    const fields = req.body;
    try {
        const campaign = await getCampaignById(fields.campaignId);
        if (campaign) {
            const loggedInUserPlayerData = campaign.users.filter(player => player.userId === req.user.id)[0];
            if (campaign.creatorId === req.user.id || (loggedInUserPlayerData && (loggedInUserPlayerData.isDM || loggedInUserPlayerData.canEdit))) {
                const _page = await getPageByNameAndCampaignIdAndParentPageId(fields.name, fields.campaignId, fields.parentPageId);
                if (!_page) {
                    const page = await createPage(fields);
                    res.send(page);
                }
                res.status(400);
                res.send({
                    name: 'PageError',
                    message: 'Could not create new page! This page may already exist at that path.'
                });
            } else {
                res.status(403);
                res.send({
                    name: 'UnauthorizedError',
                    message: `User ${req.user.username} does not have permission to create a page for campaign with id ${campaign.id}`
                });
            }
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



module.exports = router;