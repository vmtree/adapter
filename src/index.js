const cluster = require('cluster');
const app = require('./app');
require('dotenv').config();

const NUM_FORKS = process.env.NUM_FORKS || 1;
const PORT = process.env.VMT_ADAPTER_PORT || 8080;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running.`);

    for (let i = 0; i < NUM_FORKS; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} exited with code ${code}.`);
    });
} else {
    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} now listening on http://localhost:${PORT}`);
    });
}