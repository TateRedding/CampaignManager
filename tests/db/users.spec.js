const { createFakeUser } = require("../utils");

describe("DB Users", () => {
    describe("createUser", () => {
        it("Creates and returns the new user", async () => {
            const username = "Lawrence"
            const user = await createFakeUser(username);
            expect(user.username).toBe(username);
        });

        it("Does NOT return the password", async () => {
            const user = await createFakeUser();
            expect(user.password).toBeFalsy();
        });
    });
});
