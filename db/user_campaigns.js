const client = require('./index');
const { createRow } = require('./utils');

const createUserCampaign = async ({ ...fields }) => {
    return await createRow('user_campaigns', fields);
};

module.exports = {
    createUserCampaign
};