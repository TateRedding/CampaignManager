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
            const { id } = jwt.verify(token, JWTS);
            if (id) {
                req.user = await getUserById(id)
                next();
            };
        } catch (error) {
            console.error(error)
        };
    };
});

router.use('/campaigns', require('./campaigns'));
router.use('/characters', require('./characters'));
router.use('/messages', require('./messages'));
router.use('/pages', require('./pages'));
router.use('/user_campaigns', require('./user_campaigns'));
router.use('/users', require('./users'));

module.exports = router;