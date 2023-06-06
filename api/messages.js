const express = require('express');
const router = express.Router();
const { requireUser } = require('./utils');
const { getCampaignById } = require('../db/campaigns');
const {
    createMessage,
    updateMessage,
    deleteMessage,
    getMessageById
} = require('../db/messages');

router.post('/', requireUser, async (req, res, next) => {
    const fields = req.body;
    fields.senderId = req.user.id;
    try {
        const message = await createMessage(fields);
        res.send(message);
    } catch ({ name, message }) {
        next({ name, message });
    };
});

router.patch('/:messageId', requireUser, async (req, res, next) => {
    const { messageId } = req.params;
    const { content } = req.body;
    try {
        const message = await getMessageById(messageId);
        if (message.senderId === req.user.id) {
            const updatedMessage = await updateMessage(messageId, content);
            res.send(updatedMessage);
        } else {
            res.status(403);
            res.send({
                name: 'UnauthorizedUpdateError',
                message: `User ${req.user.username} does not have permission to edit message with id ${message.id}!`
            });
        };
    } catch ({ name, message }) {
        next({ name, message });
    };
});

router.delete('/:messageId', requireUser, async (req, res, next) => {
    const { messageId } = req.params;
    try {
        const message = await getMessageById(messageId);
        let campaign;
        if (message.campaignId) {
            campaign = await getCampaignById(message.campaignId);
        }
        if (message.senderId === req.user.id
            || campaign && req.user.id === campaign.creatorId
            || (message.isInvitation && req.user.id === message.recipientId)
            || req.user.isAdmin) {
            const deletedMessage = await deleteMessage(messageId);
            res.send(deletedMessage);
        } else {
            res.status(403);
            res.send({
                name: 'UnauthorizedDeleteError',
                message: `User ${req.user.username} does not have permission to delete message with id ${message.id}!`
            });
        };
    } catch ({ name, message }) {
        next({ name, message });
    };
});

module.exports = router;