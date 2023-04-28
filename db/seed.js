const client = require('./index');
const { rebuildDB } = require('./seedData');

rebuildDB()
    .catch(console.error)
    .finally(() => client.end());