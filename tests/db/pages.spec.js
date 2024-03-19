const { objectContaining } = expect;
const client = require("../../db/client");
const { updatePage, getPagesByCampaignId, getPageByNameAndCampaignIdAndParentPageId, deletePage, getPageById } = require("../../db/pages");
const { createFakeCampaign, createFakePage } = require("../utils");

describe("DB pages", () => {
    describe("createPage", () => {
        it("Creates and returns the new page", async () => {
            const name = "Strahd von Zarovich";
            const campaign = await createFakeCampaign({});
            const page = await createFakePage({
                campaignId: campaign.id,
                name
            });
            expect(page).toBeTruthy();
            expect(page).toEqual(
                objectContaining({
                    campaignId: campaign.id,
                    name
                })
            );
        });
    });

    describe("updatePage", () => {
        it("Updates and returns the updated page information", async () => {
            const page = await createFakePage({});
            const contentHTML = "<h2>Page Title</h2><p>This is not Lorme Ipsum!</p>"
            const updatedPage = await updatePage(page.id, { contentHTML });
            expect(updatedPage).toBeTruthy();
            expect(updatedPage).toEqual(
                objectContaining({
                    campaignId: page.campaignId,
                    name: page.name,
                    contentHTML
                })
            );
        });

    });

    describe("getPageById", () => {
        it("Gets the page with the given id", async () => {
            const _page = await createFakePage({});
            const page = await getPageById(_page.id);
            expect(page).toMatchObject(_page);
        });
    });

    describe("getPagesbyCampaignId", () => {
        it("Gets a list of all pages with a given campaignId", async () => {
            const numPages = 3;
            const campaign = await createFakeCampaign({});
            for (let i = 0; i< numPages; i++) {
                await createFakePage({ campaignId: campaign.id });
            };
            const pages = await getPagesByCampaignId(campaign.id);
            expect(pages).toBeTruthy();
            expect(pages.length).toEqual(numPages);
        });
    });

    describe("getPageByNameAndCampaignIdAndParentPageId", () => {
        it("Gets the page with a given name, campaignId, and parentPageId", async () => {
            const campaign = await createFakeCampaign({});
            const parentPage = await createFakePage({ campaignId: campaign.id });
            const name = "This is a sub page";
            const _page = await createFakePage({ name, parentPageId: parentPage.id, campaignId: campaign.id })
            const page = await getPageByNameAndCampaignIdAndParentPageId(name, campaign.id, parentPage.id);
            expect(page).toBeTruthy();
            expect(page).toEqual(
                objectContaining({
                    campaignId: _page.campaignId,
                    name: _page.name,
                    parentPageId: _page.parentPageId
                })
            );
        });
    });

    describe("deletePage", () => {
        it("Deletes and returns the deleted page", async () => {
            const page = await createFakePage({});
            const deletedPage = await deletePage(page.id);
            expect(deletedPage).toBeTruthy();
            expect(deletedPage).toMatchObject(page);
        });

        it("Removes the user_campaign entirely from the database", async () => {
            const _page = await createFakePage({});
            await deletePage(_page.id);
            const { rows: [page] } = await client.query(`
                SELECT *
                FROM pages
                WHERE id=${_page.id};
            `);
            expect(page).toBeFalsy();
        });
    });
});