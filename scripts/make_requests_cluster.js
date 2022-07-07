const axios = require('axios');
const cluster = require('cluster');
const { BigNumber } = require('@ethersproject/bignumber');
const { arrayify } = require('@ethersproject/bytes');
const { pack } = require('@ethersproject/solidity');
const {
    calculateNextRoot,
    poseidon: hasher,
    utils: { unsafeRandomLeaves }
} = require('vmtree-sdk');

if (cluster.isMaster) {
    cluster.fork();
    cluster.fork();
    cluster.fork();
    cluster.fork();
} else {
    (async function() {
        const startIndex = BigNumber.from(0);
        const { filledSubtrees } = calculateNextRoot({ hasher });
        const leaves = unsafeRandomLeaves(16);

        try {
            console.time(`request ${process.pid}`);
            const result = await axios.post(
                'http://localhost:8080/poseidonMassUpdate',
                {
                    data: {
                        rawData: Buffer.from(arrayify(pack(
                            (new Array(37)).fill('uint256'),
                            [ startIndex, ...filledSubtrees, ...leaves ]
                        ))).toString('base64')
                    }
                }
            );
            console.timeEnd(`request ${process.pid}`);
        } catch(err) {
            console.log(err);
        }
        process.exit();
    })();
}