const client = require("../../db/client");
const { faker } = require("@faker-js/faker");
const { objectContaining } = expect;
const {
    updateUser,
    deactivateUser,
    getUser,
    getUserById,
    getAllUserDataById,
    getPublicUserDataByUsername,
    getUserByUsername,
    getUsersLookingForGroup
} = require("../../db/users");
const {
    expectToMatchObjectWithDates,
    createFakeUser,
    createFakeCampaign,
    createFakeCampaignWithUserCampaigns,
    createFakeMessage,
    createFakeCharacter
} = require("../utils");

describe("DB Users", () => {
    describe("createUser", () => {
        it("Creates and returns the new user", async () => {
            const username = "Lawrence"
            const user = await createFakeUser({ username });
            expect(user.username).toBe(username);
        });

        it("Does NOT return the password", async () => {
            const user = await createFakeUser({});
            expect(user.password).toBeFalsy();
        });

        it("Encrypts password before storing it in the database", async () => {
            const fakeUserData = {
                password: "plainpassword"
            }
            const user = await createFakeUser({ fakeUserData });
            const queriedUser = await client.query(`
                SELECT *
                FROM users
                WHERE id = $1
            `, [user.id]);
            expect(queriedUser.password).not.toBe(fakeUserData.password);
        });
    });

    describe("updateUser", () => {
        it("Updates and returns updated user information", async () => {
            const user = await createFakeUser({});
            const username = "Theodore"
            const updatedUser = await updateUser(user.id, { username });
            expect(updatedUser).toEqual(
                objectContaining({
                    id: user.id,
                    email: user.email,
                    registerTime: user.registerTime
                })
            );
            expect(updatedUser.username).toBe(username);
        });

        it("Does NOT return the password", async () => {
            const user = await createFakeUser({});
            const updatedUser = await updateUser(user.id, { username: "Leopold" });
            expect(updatedUser.password).toBeFalsy();
        });
    });

    describe("deactivateUser", () => {
        it("Updates the user with the given userId and sets isActive to false, and creates an entry for deactivationDate", async () => {
            const user = await createFakeUser({});
            const deactivatedUser = await deactivateUser(user.id);
            expect(deactivatedUser).toBeTruthy();
            expect(deactivatedUser.isActive).toBeFalsy();
            expect(deactivatedUser.deactivationTime).toBeTruthy();
        });

        it("Does NOT remove the user's data form the database", async () => {
            const user = await createFakeUser({});
            const _deactivatedUser = await deactivateUser(user.id);
            const deactivatedUser = await getUserById(user.id);
            expectToMatchObjectWithDates(deactivatedUser, _deactivatedUser);

        });
    });

    describe("getUser", () => {
        it("Returns user data if password verifies", async () => {
            const fakeUserData = {
                username: "Nina",
                password: faker.internet.password()
            };
            await createFakeUser(fakeUserData);
            const user = await getUser(fakeUserData);
            expect(user).toBeTruthy();
            expect(user.username).toBe(fakeUserData.username);
        });

        it("Does NOT return the user data if the password does not verify", async () => {
            const fakeUserData = {
                username: "Vader",
                password: faker.internet.password()
            };
            await createFakeUser(fakeUserData);
            const user = await getUser({
                username: fakeUserData.username,
                password: 'wrongpassword'
            });
            expect(user).toBeFalsy();
        });

        it("Does NOT return the password", async () => {
            const fakeUserData = {
                username: faker.internet.userName(),
                password: faker.internet.password()
            }
            await createFakeUser(fakeUserData);
            const user = await getUser({
                username: fakeUserData.username,
                password: fakeUserData.password
            });
            expect(user.password).toBeFalsy();
        });
    });

    describe("getUserById", () => {
        it("Gets the user with the given id", async () => {
            const _user = await createFakeUser({});
            const user = await getUserById(_user.id);
            expect(user).toMatchObject(user);
        });

        it("Does NOT return the password", async () => {
            const _user = await createFakeUser({})
            const user = await getUserById(_user.id);
            expect(user.password).toBeFalsy();
        });
    });

    describe("getAllUserDataById", () => {
        it("Gets the user with the given id", async () => {
            const _user = await createFakeUser({});
            const user = await getAllUserDataById(_user.id);
            expect(user).toMatchObject(user);
        });

        it("Does NOT return the password", async () => {
            const _user = await createFakeUser({});
            const user = await getAllUserDataById(_user.id);
            expect(user.password).toBeFalsy();
        });

        it("Includes all campaigns the user is in, even if they are not looking for players", async () => {
            const _user = await createFakeUser({})
            const campaign = await createFakeCampaignWithUserCampaigns({ creatorId: _user.id, lookingForPlayers: false });
            const user = await getAllUserDataById(_user.id);
            expect(user.campaigns).toBeTruthy();
            expect(user.campaigns[0]).toMatchObject({
                id: campaign.id,
                creatorId: campaign.creatorId,
                name: campaign.name
            });
        });

        it("Includes all characters the user has created", async () => {
            const _user = await createFakeUser({});
            const character = await createFakeCharacter({ userId: _user.id });
            const user = await getAllUserDataById(_user.id);
            expect(user.characters).toBeTruthy();
            expect(user.characters[0]).toMatchObject(character);
        });

        it("Includes all invitations where the user is either the sender or recipient", async () => {
            const _user = await createFakeUser({});
            const userForRequest = await createFakeUser({});
            const campaignForInvitation = await createFakeCampaign({});
            const campaignForRequest = await createFakeCampaign({ creatorId: _user.id });
            const invitation = await createFakeMessage({
                senderId: campaignForInvitation.creatorId,
                campaignId: campaignForInvitation.id,
                recipientId: _user.id,
                type: 'invitation'
            });
            const request = await createFakeMessage({
                senderId: userForRequest.id,
                campaignId: campaignForRequest.id,
                recipientId: _user.id,
                type: 'join_request'
            });
            const user = await getAllUserDataById(_user.id);
            expect(user.invitationsAndRequests).toBeTruthy();
            expect(user.invitationsAndRequests[0]).toMatchObject({
                id: invitation.id,
                content: invitation.content,
                type: invitation.type
            });
            expect(user.invitationsAndRequests[1]).toMatchObject({
                id: request.id,
                content: request.content,
                type: request.type
            });
        });

        it("Includes all private messages where the user is either the sender or recipient", async () => {
            const _user = await createFakeUser({});
            const recipient = await createFakeUser({});
            const message = await createFakeMessage({
                senderId: _user.id,
                recipientId: recipient.id,
                type: 'private'
            });
            const user = await getAllUserDataById(_user.id);
            expect(user.privateMessages).toBeTruthy();
            expectToMatchObjectWithDates(user.privateMessages[0].messages[0], message);
        });
    });

    describe("getPublicUserDataByUsername", () => {
        it("Gets the user with the given username", async () => {
            const _user = await createFakeUser({});
            const user = await getPublicUserDataByUsername(_user.username);
            expect(user).toMatchObject(user);
        });

        it("Does NOT return the password", async () => {
            const _user = await createFakeUser({})
            const user = await getPublicUserDataByUsername(_user.username);
            expect(user.password).toBeFalsy();
        });

        it("Includes all campaigns the user is in that are looking for players", async () => {
            const _user = await createFakeUser({})
            const campaign = await createFakeCampaignWithUserCampaigns({ creatorId: _user.id, lookingForPlayers: true });
            const user = await getPublicUserDataByUsername(_user.username);
            expect(user.campaigns).toBeTruthy();
            expect(user.campaigns[0]).toMatchObject({
                id: campaign.id,
                creatorId: campaign.creatorId,
                name: campaign.name
            });
        });

        it("Includes all characters the user has created", async () => {
            const _user = await createFakeUser({});
            const character = await createFakeCharacter({ userId: _user.id });
            const user = await getPublicUserDataByUsername(_user.username);
            expect(user.characters).toBeTruthy();
            expect(user.characters[0]).toMatchObject(character);

        });
    });

    describe("getUserByUsername", () => {
        it("Gets the user with the given username", async () => {
            const _user = await createFakeUser({});
            const user = await getUserByUsername(_user.username);
            expect(user).toMatchObject(_user);
        });

        it("Does NOT return the password", async () => {
            const _user = await createFakeUser({})
            const user = await getUserByUsername(_user.username);
            expect(user.password).toBeFalsy();
        });
    });

    describe("getUsersLookingForGroup", () => {
        it("Returns a list of all users who are looking for a group", async () => {
            for (let i = 0; i < 3; i++) {
                await createFakeUser({ lookingForGroup: true });
            };
            const users = await getUsersLookingForGroup();
            expect(users.length).toBe(3);
            for (let j = 0; j < users.length; j++) {
                expect(users[j].lookingForGroup).toBeTruthy();
            };
        });

        it("Does NOT return any passwords", async () => {
            for (let i = 0; i < 3; i++) {
                await createFakeUser({ lookingForGroup: true });
            };
            const users = await getUsersLookingForGroup();
            for (let j = 0; j < users.length; j++) {
                expect(users[j].password).toBeFalsy();
            };
        });

        it("Does NOT return any users who are not looking for a group", async () => {
            const _user = await createFakeUser({ lookingForGroup: false });
            const users = await getUsersLookingForGroup();
            expect(users.filter(user => user.id === _user.id).length).toBeFalsy();
        });
    });
});
