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
        return getRowById('pages', id);
    } catch (error) {
        console.error(error);
    };
};

const getPagesByCampaignId = async (campaignId) => {
    try {
        const { rows: pages } = await client.query(`
            SELECT *
            FROM pages
            WHERE "campaignId" = ${campaignId};
    `, values);
        return pages;
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createPage,
    updatePage,
    getPageById,
    getPagesByCampaignId
}