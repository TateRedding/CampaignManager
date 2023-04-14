const express = require('express');
const jwt = require('jsonwebtoken');
const { getUserById, getUsersLookingForGroup, getUser } = require('../db/users');
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

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return;
        };
        const user = await getUser(username, password)
        if (user) {
            const token = jwt.sign({
                id: user.id,
                username
            }, process.env.JWTS, {
                expiresIn: '1w'
            });
            res.send({
                message: 'Login succesful!',
                token,
                user
            });
        } else {
            res.send({
                error: 'IncorrectCredentialsError',
                message: 'Username and password do not match!'
            });
        }
    } catch (error) {
        console.error(error);
    };
});

module.exports = router;