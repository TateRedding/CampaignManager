const express = require('express');
const { createUserCampaign } = require('../db/user_campaigns');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const userCampaign = await createUserCampaign(req.body);
        if (userCampaign) {
            res.send(userCampaign);
        } else {
            res.send({
                error: 'UserCampaignError',
                message: 'Could not add user to campaign! Are they already in it?'
            });
        };
    } catch (error) {
        console.error(error);
    };
})

module.exports = router;