const client = require('./client');
const { createRow, updateRow, getRowById } = require('./utils');

const createPage = async (fields) => {
    try {
        return await createRow('pages', fields);
    } catch (error) {
        console.error(error);
    };
};

const updatePage = async (id, fields) => {
    try {
        return await updateRow('pages', id, fields);
    } catch (error) {
        console.error(error);
    };
};

const getPageById = async (id) => {
    try {
        return await getRowById('pages', id);
    } catch (error) {
        console.error(error);
    };
};

const getPagesByCampaignId = async (campaignId) => {
    try {
        const { rows: pages } = await client.query(`
            SELECT *
            FROM pages
            WHERE "campaignId"=${campaignId};
        `);
        return pages;
    } catch (error) {
        console.error(error);
    };
};

const getPageByNameAndCampaignIdAndParentPageId = async (name, campaignId, parentPageId) => {
    try {
        const { rows: [page] } = await client.query(`
            SELECT *
            FROM pages
            WHERE name='${name}'
            AND "campaignId"=${campaignId}
            AND "parentPageId"=${parentPageId}
        `);
        return page;
    } catch (error) {
        console.error(error);
    };
}

const deletePage = async (id) => {
    try {
        const { rows: [deletedPage] } = await client.query(`
            DELETE FROM pages
            WHERE id=${id}
            RETURNING *;
        `);
        return deletedPage;
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createPage,
    updatePage,
    getPageById,
    getPagesByCampaignId,
    getPageByNameAndCampaignIdAndParentPageId,
    deletePage
};