const express = require('express');
const router = express.Router();

const { getCharacterById } = require('../db/characters');

router.get('/:characterId', async (req, res) => {
    try {
        const character = await getCharacterById(req.params.characterId);
        res.send(character);
    } catch (error) {
        console.error(error);
    };
});

module.exports = router;