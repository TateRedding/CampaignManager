const express = require('express');
const router = express.Router();
const { requireUser } = require('./utils');

const { getCharacterById, getAllPublicCharacters, getCharacterByUser, createCharacter } = require('../db/characters');

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

router.post('/', requireUser, async (req, res) => {
    const fields = req.body;
    fields.userId = req.user.id;
    try {
        const character = await createCharacter(fields);
        res.send(character);
    } catch (error) {
        console.error(error);
    };
});

module.exports = router;