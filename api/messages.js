const express = require('express');
const { requireUser } = require('./utils');
const { createMessage } = require('../db/messages');
const router = express.Router();

router.post('/', requireUser, async (req, res) => {
    const fields = req.body;
    fields.senderId = req.user.id;
    try {
        const message = await createMessage(fields);
        res.send(message);
    } catch (error) {
        console.error(error);
    };
});

module.exports = router;