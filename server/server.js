require('./config/config');

const express = require('express');
const mongoose = require('mongoose');


const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(require('./router/usuario'));


mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err, res) => {
    if (err) throw err;

    console.log('base de datos online');
});
mongoose.set('useCreateIndex', true);

app.listen(process.env.PORT, () => {
    console.log('escuchando puesto');
});