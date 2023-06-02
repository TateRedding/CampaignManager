const express = require('express');
const { requireUser } = require('./utils');
const { createMessage, updateMessage, getMessageById, getInvitationsByUserId } = require('../db/messages');
const { getCampaignById } = require('../db/campaigns');
const { deleteMessage } = require('../db/messages');
const router = express.Router();

router.get('/invites/:userId', requireUser, async (req, res, next) => {
    const { userId } = req.params;
    try {
        if (req.user.id === Number(userId)) {
            const messages = await getInvitationsByUserId(userId);
            res.send(messages);
        } else {
            res.status(403);
            res.send({
                name: 'InvitationAccessError',
                message: 'You can only access your own invitations!'
            });
        };
    } catch ({ name, message }) {
        next({ name, message });
    };
});

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
        const campaign = await getCampaignById(message.campaignId);
        if (message.senderId === req.user.id || req.user.id === campaign.creatorId || req.user.isAdmin) {
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