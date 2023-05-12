const express = require('express');
const jwt = require('jsonwebtoken');
const { JWTS } = process.env;
const {
    createUser,
    updateUser,
    deactivateUser,
    getUser,
    getUserById,
    getUserByUsername,
    getUsersLookingForGroup
} = require('../db/users');
const { requireUser } = require('./utils');
const { getCampaignsByUserId, getPublicCampaignsByUserId } = require('../db/campaigns');
const { getCharactersByUserId, getPublicCharactersByUserId } = require('../db/characters');
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

router.get('/username/:username', async (req, res, next) => {
    const { username } = req.params;
    try {
        const user = await getUserByUsername(username);
        if (user) {
            res.send(user);
        } else {
            next({
                name: 'InvalidUsername',
                message: `No user found with username ${username}`
            });
        };
    } catch ({ name, message }) {
        next({ name, message });
    };
});

router.get('/:username/campaigns', async (req, res, next) => {
    const { username } = req.params;
    try {
        const user = await getUserByUsername(username);
        if (req.user && (req.user.username === user.username || req.user.isAdmin)) {
            const campaigns = await getCampaignsByUserId(user.id);
            res.send(campaigns);
        } else {
            const campaigns = await getPublicCampaignsByUserId(user.id);
            res.send(campaigns);
        };
    } catch ({ name, message }) {
        next({ name, message });
    };
});

router.get('/:username/characters', async (req, res, next) => {
    const { username } = req.params;
    try {
        const user = await getUserByUsername(username);
        if (req.user && (req.user.username === user.username || req.user.isAdmin)) {
            const characters = await getCharactersByUserId(user.id);
            res.send(characters);
        } else {
            const characters = await getPublicCharactersByUserId(user.id);
            res.send(characters);
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
        const user = await getUser({ username, password })
        if (user) {
            const token = jwt.sign({
                id: user.id,
                username
            }, JWTS, {
                expiresIn: '1w'
            });
            delete user.password;
            res.send({
                message: 'Login succesful!',
                token,
                user
            });
        } else {
            res.status(401);
            res.send({
                name: 'IncorrectCredentialsError',
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
                name: 'UsernameTakenError',
                message: 'Username is already taken.'
            });
        } else if (password.length < 8) {
            next({
                name: 'PasswordTooShortError',
                message: 'Password must be atleast 8 characters long.'
            });
        } else {
            const user = await createUser(req.body);
            if (user) {
                delete user.password
                const token = jwt.sign({
                    id: user.id,
                    username
                }, JWTS, {
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

router.patch('/:userId', requireUser, async (req, res, next) => {
    const { userId } = req.params;
    if (req.body.username) {
        delete req.body.username;
    };
    if (req.body.password) {
        delete req.body.password;
    };
    try {
        const user = await getUserById(userId);
        if (user.id === req.user.id) {
            const updatedUser = await updateUser(userId, { ...req.body });
            res.send(updatedUser);
        } else {
            res.status(403);
            res.send({
                name: 'UnauthorizedUpdateError',
                message: 'You can only update your own profile information!'
            });
        };
    } catch ({ name, message }) {
        next({ name, message });
    };
});

router.delete("/:userId", requireUser, async (req, res, next) => {
    const { userId } = req.params;
    try {
        const user = await getUserById(userId);
        if (user.id === req.user.id || req.user.isAdmin) {
            const user = await deactivateUser(userId);
            res.send(user);
        } else {
            res.status(403);
            res.send({
                name: 'UnauthorizedDeleteError',
                message: "You must be an admin to deactivate someone else's account!"
            });
        };
    } catch ({ name, message }) {
        next({ name, message });
    };
});

module.exports = router;