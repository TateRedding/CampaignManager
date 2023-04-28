const client = require("../db/index");
const { createTables, dropTables } = require('../db/seedData');

const setup = async () => {
    console.log("--- JEST SETUP ---");
    client.connect();
    await dropTables();
    await createTables();
};

module.exports = setup;