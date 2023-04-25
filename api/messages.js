const express = require('express');
const { requireUser } = require('./utils');
const { createMessage, getMessageById, updateMessage } = require('../db/messages');
const router = express.Router();

router.post('/', requireUser, async (req, res) => {
    const fields = req.body;
    fields.senderId = req.user.id;
    try {
        const message = await createMessage(fields);
        res.send(message);
    } catch ({ name, message }) {
        next({ name, message });
    };
});

router.patch('/:messageId', requireUser, async (req, res) => {
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

module.exports = router;