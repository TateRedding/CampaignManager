const request = require("supertest");
const app = require("../../app");
const {
    expectToBeError,
    expectNotToBeError,
    createFakeUser,
    createFakeUserWithToken,
    createFakeCampaign,
    createFakeUserCampaign,
    createFakePage
} = require("../utils");

describe("/api/pages", () => {
    describe("POST /api/pages", () => {
        it("Returns the data of the newly created page", async () => {
            const { user, token } = await createFakeUserWithToken({});
            const campaign = await createFakeCampaign({ creatorId: user.id });
            const fakePageData = {
                campaignId: campaign.id,
                name: "Fake Page",
                contentHTML: "<h1>Fake Page</h1><p>This is a fake page for a fake campaign.</p>"
            };
            const response = await request(app)
                .post("/api/pages")
                .send(fakePageData)
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expect(response.body).toMatchObject(fakePageData);
        });

        it("Returns a relevant error if no campaign exists with the given campaign id", async () => {
            const { user, token } = await createFakeUserWithToken({});
            const newestCampaign = await createFakeCampaign({});
            const fakePageData = {
                campaignId: newestCampaign.id + 1,
                name: "Fake Page",
                contentHTML: "<h1>Fake Page</h1><p>This is a fake page for a fake campaign.</p>"
            };
            const response = await request(app)
                .post("/api/pages")
                .send(fakePageData)
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(404);
            expectToBeError(response.body, "CampaignNotFoundError");
        });

        it("Returns a relevant error if no user is logged in or logged in user is not the creator or a DM of the corresponding campaign", async () => {
            const user = await createFakeUser({});
            const { token } = await createFakeUserWithToken({});
            const campaign = await createFakeCampaign({ creatorId: user.id });
            const fakePageData = {
                campaignId: campaign.id,
                name: "Fake Page",
                contentHTML: "<h1>Fake Page</h1><p>This is a fake page for a fake campaign.</p>"
            };
            const noLoginResponse = await request(app).post('/api/pages');
            const loggedInResponse = await request(app)
                .post('/api/pages')
                .send(fakePageData)
                .set("Authorization", `Bearer ${token}`);
            expect(noLoginResponse.status).toBe(401);
            expectToBeError(noLoginResponse.body, 'UnauthorizedError');
            expect(loggedInResponse.status).toBe(403);
            expectToBeError(loggedInResponse.body, "UnauthorizedError");
        });

        it("Returns a relevant error if page with given name, campaignId, and parentPageId already exists", async () => {
            const { user, token } = await createFakeUserWithToken({});
            const campaign = await createFakeCampaign({ creatorId: user.id });
            const parentPage = await createFakePage({});
            await createFakePage({
                campaignId: campaign.id,
                name: "Fake Page",
                parentPageId: parentPage.id
            });
            const response = await request(app)
                .post("/api/pages")
                .send({
                    campaignId: campaign.id,
                    name: "Fake Page",
                    parentPageId: parentPage.id
                })
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(400);
            expectToBeError(response.body, "PageError");
        });
    });

    describe("PATCH /api/pages/:pageId", () => {
        it("Returns the data of the updated page if logged in user is the creator of the corresponding campaign", async () => {
            const { user, token } = await createFakeUserWithToken({});
            const campaign = await createFakeCampaign({ creatorId: user.id });
            const newName = "New Fake Page Name";
            const page = await createFakePage({
                campaignId: campaign.id,
                name: "Fake Page",
            });
            const response = await request(app)
                .patch(`/api/pages/${page.id}`)
                .send({ name: newName })
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expect(response.body.name).toBe(newName);
        });

        it("Returns the data of the updated page if logged in user is a DM of the corresponding campaign", async () => {
            const { user, token } = await createFakeUserWithToken({});
            const campaign = await createFakeCampaign({});
            const newName = "New Fake Page Name";
            const page = await createFakePage({
                campaignId: campaign.id,
                name: "Fake Page",
            });
            await createFakeUserCampaign({
                userId: user.id,
                campaignId: campaign.id,
                isDM: true
            });
            const response = await request(app)
                .patch(`/api/pages/${page.id}`)
                .send({ name: newName })
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expect(response.body.name).toBe(newName);
        });

        it("Returns the data of the updated page if logged in user is NOT a DM of the corresponding campaign, but has editing privileges", async () => {
            const { user, token } = await createFakeUserWithToken({});
            const campaign = await createFakeCampaign({});
            const newName = "New Fake Page Name";
            const page = await createFakePage({
                campaignId: campaign.id,
                name: "Fake Page",
            });
            await createFakeUserCampaign({
                userId: user.id,
                campaignId: campaign.id,
                isDM: false,
                canEdit: true
            });
            const response = await request(app)
                .patch(`/api/pages/${page.id}`)
                .send({ name: newName })
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expect(response.body.name).toBe(newName);
        });

        it("Returns a relevant error if no user is logged in or logged in user is not the creator, a DM of the corresponding campaign, or does not have editing priveleges", async () => {
            const { user, token } = await createFakeUserWithToken({});
            const campaign = await createFakeCampaign({});
            await createFakeUserCampaign({
                userId: user.id,
                campaignId: campaign.id,
                isDM: false,
                canEdit: false
            });
            const page = await createFakePage({
                campaignId: campaign.id,
                name: "Fake Page",
            });
            const noLoginResponse = await request(app).patch(`/api/pages/${page.id}`);
            const loggedInResponse = await request(app)
                .patch(`/api/pages/${page.id}`)
                .send({ isDM: true })
                .set("Authorization", `Bearer ${token}`);
            expect(noLoginResponse.status).toBe(401);
            expectToBeError(noLoginResponse.body, 'UnauthorizedError');
            expect(loggedInResponse.status).toBe(403);
            expectToBeError(loggedInResponse.body, "UnauthorizedUpdateError");
        });
    });

    describe("DELETE /api/pages/:pageId", () => {
        it("Returns the data of the deleted page if logged in user is the creator of the campaign", async () => {
            const { user, token } = await createFakeUserWithToken({});
            const campaign = await createFakeCampaign({ creatorId: user.id });
            const page = await createFakePage({
                campaignId: campaign.id,
                name: "Fake Page",
            });
            const response = await request(app)
                .delete(`/api/pages/${page.id}`)
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expect(response.body).toMatchObject(page);
        });

        it("Returns the data of the deleted page if logged in user is NOT the creator of the campaign, but is  an admin", async () => {
            const { user, token } = await createFakeUserWithToken({ isAdmin: true })
            const campaign = await createFakeCampaign({});
            const page = await createFakePage({
                campaignId: campaign.id,
                name: "Fake Page",
            });
            const response = await request(app)
                .delete(`/api/pages/${page.id}`)
                .set("Authorization", `Bearer ${token}`);
            expectNotToBeError(response.body);
            expect(response.body).toMatchObject(page);
        });

        it("Returns a relevant error if no user is logged in or logged in user is NOT the creatpr of the corresponding campaign, or an admin", async () => {
            const { token } = await createFakeUserWithToken({});
            const campaign = await createFakeCampaign({});
            const page = await createFakePage({
                campaignId: campaign.id,
                name: "Fake Page",
            });
            const noLoginResponse = await request(app).delete(`/api/pages/${page.id}`);
            const loggedInResponse = await request(app)
                .delete(`/api/pages/${page.id}`)
                .set("Authorization", `Bearer ${token}`);
            expect(noLoginResponse.status).toBe(401);
            expectToBeError(noLoginResponse.body, 'UnauthorizedError');
            expect(loggedInResponse.status).toBe(403);
            expectToBeError(loggedInResponse.body, "UnauthorizedDeleteError");
        });
    });
});