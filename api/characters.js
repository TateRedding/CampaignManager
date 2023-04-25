const express = require('express');
const router = express.Router();
const { requireUser } = require('./utils');

const { getCharacterById, getAllPublicCharacters, createCharacter, updateCharacter } = require('../db/characters');

router.get('/', async (req, res, next) => {
    try {
        const characters = await getAllPublicCharacters();
        res.send(characters);
    } catch ({ name, message }) {
        next({ name, message });
    };
});

router.get('/:characterId', async (req, res, next) => {
    try {
        const character = await getCharacterById(req.params.characterId);
        res.send(character);
    } catch ({ name, message }) {
        next({ name, message });
    };
});

router.post('/', requireUser, async (req, res) => {
    const fields = req.body;
    fields.userId = req.user.id;
    try {
        const character = await createCharacter(fields);
        res.send(character);
    } catch ({ name, message }) {
        next({ name, message });
    };
});

router.patch('/:characterId', requireUser, async (req, res, next) => {
    const { characterId } = req.params;
    try {
        const character = await getCharacterById(characterId);
        if (character.userId === req.user.id) {
            const updatedCharacter = await updateCharacter(characterId, { ...req.body });
            res.send(updatedCharacter);
        } else {
            res.status(403);
            res.send({
                name: 'UnauthorizedUpdateError',
                message: `User ${req.user.username} does not have permission to edit ${character.name}!`
            });
        };
    } catch ({ name, message }) {
        next({ name, message });
    };
});

module.exports = router;