const client = require('./index');
const { createRow } = require('./utils');

const createCampaign = async ({ ...fields }) => {
    return await createRow('campaigns', fields);
};

module.exports = {
    createCampaign
};