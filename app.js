require('dotenv').config();

const express = require('express');
const app = express();

const morgan = require('morgan');
app.use(morgan('dev'));

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

const path = require('path');
app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

const apiRouter = require('./api/index');
app.use('/api', apiRouter);

app.use('*', (req, res) => {
    res.status(404);
    res.send({
        name: 'RouteNotFound',
        message: 'That page does not exist'
    });
});

app.use((err, req, res, next) => {
    res.status(500);
    res.send({
        name: err.name,
        message: err.message
    });
});

module.exports = app;