const express = require('express');

const app = express();

app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('../router/categoria'));
app.use(require('../router/producto'));
app.use(require('../router/upload'));
app.use(require('../router/imagenes'));

module.exports = app;