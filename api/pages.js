const express = require('express');
const {
    createPage,
    updatePage,
    getPageById,
    deletePage,
    getPageByNameAndCampaignIdAndParentPageId,
} = require('../db/pages');
const { requireUser } = require('./utils');
const { getCampaignById } = require('../db/campaigns');
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

router.patch('/:pageId', requireUser, async (req, res, next) => {
    const { pageId } = req.params;
    try {
        const page = await getPageById(pageId);
        const campaign = await getCampaignById(page.campaignId);
        const loggedInUserPlayerData = campaign.users.filter(player => player.userId === req.user.id)[0];
        if (campaign.creatorId === req.user.id || (loggedInUserPlayerData && (loggedInUserPlayerData.isDM || loggedInUserPlayerData.canEdit))) {
            const updatedPage = await updatePage(pageId, { ...req.body });
            res.send(updatedPage);
        } else {
            res.status(403);
            res.send({
                name: 'UnauthorizedUpdateError',
                message: `User ${req.user.username} does not have permission to update pages in campaign with id ${campaign.id}`
            });
        };
    } catch ({ name, message }) {
        next({ name, message });
    };
});

router.delete('/:pageId', requireUser, async (req, res, next) => {
    const { pageId } = req.params;
    try {
        const page = await getPageById(pageId);
        const campaign = await getCampaignById(page.campaignId);
        if (campaign.creatorId === req.user.id || req.user.isAdmin) {
            const deletedPage = await deletePage(pageId);
            res.send(deletedPage);
        } else {
            res.status(403);
            res.send({
                name: 'UnauthorizedDeleteError',
                message: `User ${req.user.username} does not have permission permission to remove pages in campaign with id ${campaign.id}`
            });
        };
    } catch ({ name, message }) {
        next({ name, message });
    };
});

module.exports = router;