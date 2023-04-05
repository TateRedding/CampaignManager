const client = require('./index');

const createRow = async (table, fields) => {
    const valuesString = Object.keys(fields).map((key, index) => `$${index + 1}`).join(', ');
    const columnNames = Object.keys(fields).map((key) => `"${key}"`).join(', ');
    try {
        const { rows: [result] } = await client.query(`
            INSERT INTO ${table}(${columnNames})
            VALUES (${valuesString})
            RETURNING *;
        `, Object.values(fields));
        return result;
    } catch (error) {
        console.error(error);
    };
};

const getTrueProficiencies = (arr) => {
    return Object.keys(arr).reduce((acc, key) => {
        if (key !== 'id' && arr[key]) {
            acc.push(key);
        };
        return acc;
    }, []);
}

module.exports = {
    createRow,
    getTrueProficiencies
};