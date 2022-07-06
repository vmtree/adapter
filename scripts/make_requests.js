const axios = require('axios');
const { BigNumber } = require('@ethersproject/bignumber');
const { arrayify } = require('@ethersproject/bytes');
const { pack } = require('@ethersproject/solidity');
const {
    calculateNextRoot,
    poseidon: hasher,
    utils: { unsafeRandomLeaves }
} = require('vmtree-sdk');

(async function() {
    const startIndex = BigNumber.from(0);
    const { filledSubtrees } = calculateNextRoot({ hasher });
    const leaves = unsafeRandomLeaves(16);

    try {
        console.time('requests');
        var requests = [];
        for (let i = 0; i < 3; i++) {
            requests.push(axios.post(
                'http://localhost:8080/poseidonMassUpdate',
                {
                    data: {
                        rawData: Buffer.from(arrayify(pack(
                            (new Array(37)).fill('uint256'),
                            [ startIndex, ...filledSubtrees, ...leaves ]
                        ))).toString('base64')
                    }
                }
            ));
        }
        const results = await Promise.all(requests);
        console.timeEnd('requests');
    } catch(err) {
        console.log(err);
    }
})();