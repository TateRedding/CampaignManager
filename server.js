const app = require('./app');
const PORT = process.env.PORT || 3000;
const client = require('./db/index');

app.listen(PORT, () => {
    client.connect();
    console.log(`Server listening on port ${PORT}`);
});