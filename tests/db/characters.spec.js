const { objectContaining } = expect;
const {
    updateCharacter,
    getCharacterById,
    getAllPublicCharacters,
    getCharactersByUserId
} = require("../../db/characters");
const {
    createFakeUser,
    createFakeCharacter
} = require("../utils");

describe("DB characters", () => {
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

    describe("getAllPublicCharacters", () => {
        it("Gets a list of all public characters", async () => {
            const numCharacters = 3;
            for (let i = 0; i < numCharacters; i++) {
                await createFakeCharacter({});
            };
            const characters = await getAllPublicCharacters();
            expect(characters).toBeTruthy();
            expect(characters.length).toBeGreaterThanOrEqual(numCharacters);
        });

        it("Does NOT include private characters", async () => {
            const privateCharacter = await createFakeCharacter({ isPublic: false });
            const characters = await getAllPublicCharacters();
            expect(characters.filter(character => character.id === privateCharacter.id).length).toBeFalsy();
        });
    });

    describe("getCharactersByUserId", () => {
        it("Gets a list of characters with a given userId", async () => {
            const numCharacters = 3;
            const user = await createFakeUser({});
            for (let i = 0; i < numCharacters; i++) {
                await createFakeCharacter({ userId: user.id });
            };
            const characters = await getCharactersByUserId(user.id);
            expect(characters).toBeTruthy();
            expect(characters.length).toBe(numCharacters);
        });
    })
});