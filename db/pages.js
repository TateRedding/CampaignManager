const client = require('./client');
const { createRow, updateRow } = require('./utils');

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
    getPagesByCampaignId,
    deletePage
}