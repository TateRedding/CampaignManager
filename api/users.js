const express = require('express');
const jwt = require('jsonwebtoken');
const { JWTS } = process.env;
const { createUser, getUserById, getUsersLookingForGroup, getUser, getUserByUsername, updateUser } = require('../db/users');
const { requireUser } = require('./utils');
const { getCampaignsByUser } = require('../db/campaigns');
const { getCharactersByUser } = require('../db/characters');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const users = await getUsersLookingForGroup();
        res.send(users);
    } catch (error) {
        console.error(error);
    };
});

router.get('/me', requireUser, async (req, res) => {
    try {
        const user = await getUserById(req.user.id);
        res.send(user);
    } catch (error) {
        console.error(error);
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const user = await getUserById(req.params.userId);
        res.send(user);
    } catch (error) {
        console.error(error);
    };
});

router.get('/:username/campaigns', requireUser, async (req, res) => {
    const { username } = req.params;
    try {
        const user = await getUserByUsername(username);
        if (req.user && req.user.username === user.username) {
            const campaigns = await getCampaignsByUser(user);
            res.send(campaigns);
        } else {
            // get public campaigns by user
        };
    } catch (error) {
        console.error(error);
    };
});

router.get('/:username/characters', requireUser, async (req, res) => {
    const { username } = req.params;
    try {
        const user = await getUserByUsername(username);
        if (req.user && req.user.username === user.username) {
            const characters = await getCharactersByUser(user);
            res.send(characters);
        } else {
            // get public characters by user
        };
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

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return;
        };
        const existingUser = await getUserByUsername(username);
        if (existingUser) {
            res.send({
                error: 'UsernameTakenError',
                message: 'Username is already taken.'
            });
        } else if (password.length < 8) {
            res.send({
                error: 'PasswordTooShortError',
                message: 'Password must be atleast 8 characters long.'
            });
        } else {
            const user = await createUser(req.body);
            if (user) {
                delete user.password
                const token = jwt.sign({
                    id: user.id,
                    username
                }, process.env.JWTS, {
                    expiresIn: '1w'
                });
                res.send({
                    message: 'Thank you for signing up!',
                    token,
                    user
                });
            }
        }
    } catch (error) {
        console.error(error);
    };
});

router.patch(':userId', requireUser, async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await getUserById(userId);
        if (user.id === req.user.id) {
            const updatedUser = await updateUser(userId, { ...req.body });
            res.send(updatedUser);
        } else {
            res.status(403);
            res.send({
                error: 'UnauthorizedUpdateError',
                message: `You can only update your own profile information!`
            });
        };
    } catch (error) {
        console.error(error);
    };
});

module.exports = router;