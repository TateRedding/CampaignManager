const client = require('./index');
const { createRow } = require('./utils');

const createMessage = async ({ ...fields }) => {
    return await createRow('messages', fields);
};

module.exports = {
    createMessage
};