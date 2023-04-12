const express = require('express');
const router = express.Router();

const { getAllPublicCampaigns } = require('../db/campaigns');

router.get('/', async (req, res) => {
    try {
        const campaigns = await getAllPublicCampaigns();
        res.send(campaigns);
    } catch (error) {
        console.error(error);
    };
});

module.exports = router;