const express = require('express');
const jwt = require('jsonwebtoken');
const { createUser, getUserById, getUsersLookingForGroup, getUser, getUserByUsername } = require('../db/users');
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

module.exports = router;