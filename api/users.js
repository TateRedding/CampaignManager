const express = require('express');
const { getUserById, getUsersLookingForGroup } = require('../db/users');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const users = await getUsersLookingForGroup();
        res.send(users);
    } catch (error) {
        console.error(error);
    };
});

router.get('/:userId', async (req, res) => {
    try {
        const user = await getUserById(req.params.userId);
        res.send(user);
    } catch (error) {
        console.error(error);
    };
});

module.exports = router;