const express = require('express');
const jwt = require('jsonwebtoken');
const { JWTS } = process.env;
const { createUser, getUserById, getUsersLookingForGroup, getUser, getUserByUsername, updateUser } = require('../db/users');
const { requireUser } = require('./utils');
const { getCampaignsByUserId } = require('../db/campaigns');
const { getCharactersByUserId } = require('../db/characters');
const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const users = await getUsersLookingForGroup();
        res.send(users);
    } catch ({ name, message }) {
        next({ name, message });
    };
});

router.get('/me', requireUser, async (req, res, next) => {
    try {
        const user = await getUserById(req.user.id);
        res.send(user);
    } catch ({ name, message }) {
        next({ name, message });
    };
});

router.get('/id/:userId', async (req, res, next) => {
    const { userId } = req.params;
    try {
        const user = await getUserById(userId);
        if (user) {
            res.send(user);
        } else {
            next({
                name: 'InvalidUserId',
                message: `No user found with id ${userId}`
            });
        };
    } catch ({ name, message }) {
        next({ name, message });
    };
});

router.get('/:username/campaigns', requireUser, async (req, res, next) => {
    const { username } = req.params;
    try {
        const user = await getUserByUsername(username);
        if (req.user && req.user.username === user.username) {
            const campaigns = await getCampaignsByUserId(user.id);
            res.send(campaigns);
        } else {
            // get public campaigns by user
        };
    } catch ({ name, message }) {
        next({ name, message });
    };
});

router.get('/:username/characters', requireUser, async (req, res, next) => {
    const { username } = req.params;
    try {
        const user = await getUserByUsername(username);
        if (req.user && req.user.username === user.username) {
            const characters = await getCharactersByUserId(user.id);
            res.send(characters);
        } else {
            // get public characters by user
        };
    } catch ({ name, message }) {
        next({ name, message });
    };
});

router.post('/login', async (req, res, next) => {
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
            res.status(401);
            res.send({
                error: 'IncorrectCredentialsError',
                message: 'Username and password do not match!'
            });
        }
    } catch ({ name, message }) {
        next({ name, message });
    };
});

router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return;
        };
        const existingUser = await getUserByUsername(username);
        if (existingUser) {
            next({
                error: 'UsernameTakenError',
                message: 'Username is already taken.'
            });
        } else if (password.length < 8) {
            next({
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
    } catch ({ name, message }) {
        next({ name, message });
    };
});

router.patch(':userId', requireUser, async (req, res, next) => {
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
    } catch ({ name, message }) {
        next({ name, message });
    };
});

module.exports = router;