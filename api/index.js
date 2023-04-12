const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const { JWTS } = process.env;

const { getUserById } = require('../db/users');

router.use(async (req, res, next) => {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');

    if (!auth) {
        next();
    } else if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length)
        try {
            const { id } = jwt.verify(token, JWT_SECRET)
            if (id) {
                req.user = await getUserById(id)
                next();
            };
        } catch (error) {
            console.error(error)
        };
    };
});

const campaignsRouter = require('./campaigns');
router.use('/campaigns', campaignsRouter);

const charactersRouter = require('./characters');
router.use('/characters', charactersRouter);

const messagesRouter = require('./messages');
router.use('/messages', messagesRouter);

const proficienciesRouter = require('./proficiencies');
router.use('/proficiencies', proficienciesRouter);

const userCampaignsRouter = require('./userCampaigns');
router.use('/user_campaigns', userCampaignsRouter);

const usersRouter = require('./users');
router.use('/users', usersRouter);

module.exports = router;