const express = require('express');
const router = express.Router();

const { getCharacterById, getAllPublicCharacters, getCharacterByUser } = require('../db/characters');

router.get('/', async (req, res) => {
    try {
        const characters = await getAllPublicCharacters();
        res.send(characters);
    } catch (error) {
        console.error(error);
    };
});

router.get('/:characterId', async (req, res) => {
    try {
        const character = await getCharacterById(req.params.characterId);
        res.send(character);
    } catch (error) {
        console.error(error);
    };
});

router.get('/users/:userId'), async (req, res) => {
    try {
        const characters = await getCharacterByUser(req.params.userId);
        res.send(characters);
    } catch (error) {
        console.error(error);
    };
};

module.exports = router;