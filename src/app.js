const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const poseidonMassUpdate = require('./endpoints/poseidonMassUpdate');

app.use(cors());
app.use(bodyParser.json());

app.post('/poseidonMassUpdate', poseidonMassUpdate);

module.exports = app;