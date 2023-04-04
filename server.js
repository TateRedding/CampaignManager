require('dotenv').config();

const express = require('express');
const app = express();

const morgan = require('morgan');
app.use(morgan('dev'));

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

// Uncomment when connecting front end
// const path = require('path');
// app.use('/dist', express.static(path.join(__dirname, 'dist')));
// app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

const apiRouter = require('./api/index');
app.use('/api', apiRouter);

app.use('*', (req, res, next) => {
    res.status(404);
    res.send({ error: 'route not found' });
});

app.use((err, req, res, next) => {
    res.status(500);
    res.send({ error: err.message });
});

const PORT = process.env.PORT || 3000;
const client = require('./db/index');
app.listen(PORT, () => {
    client.connect();
    console.log(`Server listening on port ${PORT}`);
});