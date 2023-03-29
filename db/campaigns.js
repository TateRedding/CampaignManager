const client = require('./index');

const createCampaign = async({...fields}) => {
    const valuesString = Object.keys(fields).map((key, index) => `$${index + 1}`).join(', ');
    const columnNames = Object.keys(fields).map((key) => `"${key}"`).join(', ');
    try {
        const { rows: [campaign] } = await client.query(`
            INSERT INTO campaigns(${columnNames})
            VALUES (${valuesString})
            RETURNING *;
        `, Object.values(fields));
        return campaign;
    } catch (error) {
        console.error(error);
    };
};

module.exports = {
    createCampaign
};