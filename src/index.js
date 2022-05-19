const app = require('./app');
require('dotenv').config();

const PORT = process.env.VMT_ADAPTER_PORT || 8080;

app.listen(PORT, () => {
    console.log(`Now listening on http://localhost:${PORT}`);
});