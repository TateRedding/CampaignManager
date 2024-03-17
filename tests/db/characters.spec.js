const { emptyTables } = require('../utils');
const { objectContaining } = expect;
const {
    updateCharacter,
    getCharacterById,
    getAllCharacters,
    getCharactersByUserId,
    deleteCharacter,
} = require("../../db/characters");
const {
    createFakeUser,
    createFakeCharacter
} = require("../utils");
const { treddFargrim, thyriLittleflower } = require('../../db/characterObjects');
const { validateCharacterData } = require('../../db/characterValidation');

describe("DB characters", () => {

    beforeEach(async () => emptyTables());

    describe("validateCharacterData", () => {
        it("Validates the JSON data of a new characters table entry for JSONB columns", async () => {
            const goodCharacterData = thyriLittleflower;
            const validationPassed = validateCharacterData("new", goodCharacterData);
            expect(validationPassed).toBeTruthy();
        });

        it("Validates the JSON data of a characters table update for JSONB columns", async () => {
            const characterUpdateData = {
                class: {
                    0: {
                        level: 2
                    },
                    2: {
                        subclass: "Circle of the Land"
                    }
                },
                hitDice: {
                    1: {
                        total: 2,
                        remaining: 2
                    }
                }
            };
            const validationPassed = validateCharacterData("update", characterUpdateData);
            expect(validationPassed).toBeTruthy();
        });

        it("Throws relevant errors if the data does not match the JSON schema", async () => {
            const badCharacterData = treddFargrim;
            badCharacterData.abilities.dexterity.proficiency = "string";
            expect(() => {
                validateCharacterData("new", badCharacterData);
            }).toThrow("must be boolean");
        });
    })

    describe("createCharacter", () => {
        it("Creates and returns the new character", async () => {
            const name = "Robi Xenon Li"
            const character = await createFakeCharacter({ name });
            expect(character).toBeTruthy();
            expect(character.name).toBe(name);
        });
    });

    describe("updateCharacter", () => {
        it("Updates base level table data and returns updated character information", async () => {
            const name = "Yog So'thoth"
            const level = 14;
            const character = await createFakeCharacter({});
            const updatedCharacter = await updateCharacter(character.id, { name, level });
            expect(updatedCharacter).toEqual(
                objectContaining({
                    id: character.id,
                    userId: character.userId,
                    alignment: character.alignment,
                })
            );
            expect(updatedCharacter.name).toBe(name);
            expect(updatedCharacter.level).toBe(level);
        });

        it("Updates JSON data and returns updated character information", async () => {
            const character = await createFakeCharacter({});
            const updatedCharacterAbilities = character.abilities;
            updatedCharacterAbilities.strength.score = 13;
            const updatedCharacter = await updateCharacter(character.id, { abilities: updatedCharacterAbilities });
            expect(updatedCharacter).toEqual(
                objectContaining({
                    id: character.id,
                    userId: character.userId,
                    alignment: character.alignment,
                })
            );
            expect(updatedCharacter.abilities.strength.score).toBe(13);
        });

        it("Updates JSON data of an existing array element and returns updated character information", async () => {
            const character = await createFakeCharacter({});
            const updatedCharacterClass = character.class[0];
            updatedCharacterClass.baseClass = "paladin";
            updatedCharacterClass.level = 4;
            const updatedCharacter = await updateCharacter(character.id, { class: { 0: updatedCharacterClass } });
            expect(updatedCharacter).toEqual(
                objectContaining({
                    id: character.id,
                    userId: character.userId,
                    alignment: character.alignment,
                })
            );
            expect(updatedCharacter.class[0].baseClass).toBe("paladin");
            expect(updatedCharacter.class[0].level).toBe(4);
        });

        it("Updates JSON data by adding a new array element and returns updated character information", async () => {
            const character = await createFakeCharacter({});
            const newSpellIndex = character.spells ? character.spells.length + 1 : 0;
            const newSpell = {
                name: "Produce Flame",
                attackBonus: 7,
                damageDie: 8,
                damageDieCount: 3,
                damageBonus: 0,
                damageType: "fire",
                save: false
            };
            const updatedSpells = {};
            updatedSpells[newSpellIndex] = newSpell;
            const updatedCharacter = await updateCharacter(character.id, { spells: updatedSpells });
            expect(updatedCharacter).toEqual(
                objectContaining({
                    id: character.id,
                    userId: character.userId,
                    alignment: character.alignment,
                })
            );
            expect(updatedCharacter.spells[newSpellIndex]).toMatchObject(newSpell);
        });
    });

    describe("getCharacterById", () => {
        it("Gets the character with the given id", async () => {
            const _character = await createFakeCharacter({});
            const character = await getCharacterById(_character.id);
            expect(character).toMatchObject(_character);
        });
    });

    describe("getAllCharacters", () => {
        it("Gets a list of all characters", async () => {
            const numCharacters = 3;
            for (let i = 0; i < numCharacters; i++) {
                await createFakeCharacter({});
            };
            const characters = await getAllCharacters();
            expect(characters).toBeTruthy();
            expect(characters.length).toBe(numCharacters);
        });
    });

    describe("getCharactersByUserId", () => {
        it("Gets a list of all characters with a given userId", async () => {
            const numCharacters = 3;
            const user = await createFakeUser({});
            for (let i = 0; i < numCharacters; i++) {
                await createFakeCharacter({ userId: user.id });
            };
            const characters = await getCharactersByUserId(user.id);
            expect(characters).toBeTruthy();
            expect(characters.length).toBe(numCharacters);
        });
    });

    describe("deleteCharacter", () => {
        it("Returns the data of the deleted character", async () => {
            const character = await createFakeCharacter({});
            const deletedCharacter = await deleteCharacter(character.id);
            expect(deletedCharacter).toBeTruthy();
            expect(deletedCharacter).toMatchObject(character);
        });

        it("Completeley removes the character from the database", async () => {
            const character = await createFakeCharacter({});
            await deleteCharacter(character.id);
            const deletedCharacter = await getCharacterById(character.id);
            expect(deletedCharacter).toBeFalsy();
        });
    });
});