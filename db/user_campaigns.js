const client = require('./index');

const createUserCampaign = async({ ...fields }) => {
    const valuesString = Object.keys(fields).map((key, index) => `$${index + 1}`).join(', ');
    const columnNames = Object.keys(fields).map((key) => `"${key}"`).join(', ');
    try {
        const { rows: [userCampaign] } = await client.query(`
            INSERT INTO user_campaigns(${columnNames})
            VALUES (${valuesString})
            RETURNING *;
        `, Object.values(fields));
        return userCampaign;
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createUserCampaign
};