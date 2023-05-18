const { emptyTables } = require('../utils');
const { objectContaining } = expect;
const {
    updateCharacter,
    getCharacterById,
    getAllCharacters,
    getCharactersByUserId,
    destroyCharacter,
} = require("../../db/characters");
const {
    createFakeUser,
    createFakeCharacter
} = require("../utils");

describe("DB characters", () => {

    beforeEach(async () => emptyTables());

    describe("createCharacter", () => {
        it("Creates and returns the new character", async () => {
            const name = "Robi Xenon Li"
            const character = await createFakeCharacter({ name });
            expect(character).toBeTruthy();
            expect(character.name).toBe(name);
        });
    });

    describe("updateCharacter", () => {
        it("Updates and returns updated character information", async () => {
            const name = "Yog So'thoth"
            const character = await createFakeCharacter({});
            const updatedCharacter = await updateCharacter(character.id, { name });
            expect(updatedCharacter).toEqual(
                objectContaining({
                    id: character.id,
                    userId: character.userId,
                    alignment: character.alignment,
                })
            );
            expect(updatedCharacter.name).toBe(name);
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

    describe("destroyCharacter", () => {
        it("Returns the data of the deleted character", async () => {
            const character = await createFakeCharacter({});
            const deletedCharacter = await destroyCharacter(character.id);
            expect(deletedCharacter).toBeTruthy();
            expect(deletedCharacter).toMatchObject(character);
        });

        it("Completeley removes the character from the database", async () => {
            const character = await createFakeCharacter({});
            await destroyCharacter(character.id);
            const deletedCharacter = await getCharacterById(character.id);
            expect(deletedCharacter).toBeFalsy();
        });
    });
});