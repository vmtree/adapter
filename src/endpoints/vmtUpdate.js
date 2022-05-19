const path = require('path');
const {
    calculateSubtrees,
    calculateUpdateProof,
    mimcSponge,
    utils,
} = require('vmtjs');

const { toVmtUpdateSolidityInput: toSolInput } = utils;
const wasmPath = path.resolve(`${__dirname}/../zk-stuff/update.wasm`);
const zkeyPath = path.resolve(`${__dirname}/../zk-stuff/update.zkey`);

module.exports = async function vmtUpdate(req, res) {
    if (!req.body.data) {
        return res.status(400).json({
            error: 'expected `data` in body of request'
        });
    }
    console.log(req.body.data);

    const { startIndex, leaf, filledSubtrees } = req.body.data;

    if (
        (typeof startIndex !== 'number')
        || (!Array.isArray(filledSubtrees) || filledSubtrees.length !== 20)
    ) {
        return res.status(400).json({
            error: 'malformed request'
        });
    }

    try {
        const endSubtrees = calculateSubtrees(
            mimcSponge,
            20,
            startIndex,
            [leaf],
            filledSubtrees
        );

        const { proof, publicSignals } = await calculateUpdateProof(
            wasmPath,
            zkeyPath,
            startIndex,
            leaf,
            filledSubtrees,
            endSubtrees
        );

        const { p, newSubtrees } = toSolInput(proof, publicSignals);
        return res.status(200).json({
            proof: p,
            newFilledSubtrees: newSubtrees
        });
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            error: 'something went wrong'
        })
    }
}