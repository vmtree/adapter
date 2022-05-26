const path = require('path');
const axios = require('axios');
const {
    calculateSubtrees,
    calculateMassUpdateProof,
    mimcSponge,
    utils,
} = require('vmtjs');
const ethers = require('ethers');

const { toVmtMassUpdateSolidityInput: toSolInput } = utils;
const wasmPath = path.resolve(`${__dirname}/../zk-stuff/massUpdate.wasm`);
const zkeyPath = path.resolve(`${__dirname}/../zk-stuff/massUpdate.zkey`);

module.exports = async function vmtMassUpdate(req, res, next) {
    console.log('Received request');
    console.time('requestTime');
    if (!req.body.data) {
        return res.status(400).json({
            error: 'expected `data` in body of request'
        });
    }

    const { rawData } = req.body.data;

    const buf = Buffer.from(rawData, "base64");
    if (buf.length !== 992) {
        return res.status(400).json({
            error: `unexpected data length: ${buf.length} (expected 992)`
        });
    }
    const hexDataString = ethers.utils.hexlify(buf).slice(2);

    const leaves = [], filledSubtrees = [];
    for (let i = 0; i < 10; i++) {
        leaves.push(
            ethers.BigNumber.from(
                '0x' + hexDataString.slice(i * 64, (i * 64) + 64)
            )
        );
    }
    for (let i = 10; i < 30; i++) {
        filledSubtrees.push(
            ethers.BigNumber.from(
                '0x' + hexDataString.slice(i * 64, (i * 64) + 64)
            )
        );
    }
    const startIndex = ethers.BigNumber.from(
        '0x' + hexDataString.slice(1920)
    );

    // if (
    //     (typeof startIndex !== 'number')
    //     || (!Array.isArray(leaves) || leaves.length !== 10)
    //     || (!Array.isArray(filledSubtrees) || filledSubtrees.length !== 20)
    // ) {
    //     return res.status(400).json({
    //         error: 'malformed request'
    //     });
    // }

    try {
        const endSubtrees = calculateSubtrees(
            mimcSponge,
            20,
            Number(startIndex),
            leaves,
            filledSubtrees
        );

        console.time('zkproofTime');
        const { proof, publicSignals } = await calculateMassUpdateProof(
            wasmPath,
            zkeyPath,
            startIndex,
            leaves,
            filledSubtrees,
            endSubtrees
        );
        console.timeEnd('zkproofTime');

        const { p, newSubtrees } = toSolInput(proof, publicSignals);
        console.timeEnd('requestTime');
        return res.status(200).json({
            data: {
                proof: p,
                newFilledSubtrees: newSubtrees
            }
        });
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            error: 'something went wrong'
        })
    }
}