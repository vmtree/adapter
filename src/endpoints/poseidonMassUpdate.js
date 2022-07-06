const path = require('path');
const {
    fullProvePoseidon,
    verifyProof
} = require('vmtree-sdk');
const { BigNumber } = require('@ethersproject/bignumber');

const wasmFileName = path.resolve(`${__dirname}/../zk-stuff/mass_update.wasm`);
const zkeyFileName = path.resolve(`${__dirname}/../zk-stuff/mass_update.zkey`);
const verifierJson = require(path.resolve(`${__dirname}/../zk-stuff/mass_update_verifier.json`));

module.exports = async function poseidonMassUpdate(req, res) {
    const t = Date.now();
    console.time(`poseidonMassUpdate ${t}`);

    if (!req.body.data || !req.body.data.rawData) {
        return res.status(400).json({
            error: 'expected data'
        });
    }

    const buf = Buffer.from(req.body.data.rawData, "base64");
    if (buf.length !== 1184) {
        return res.status(400).json({
            error: `unexpected data length: ${l} (expected 1184 == 37 evm words)`
        });
    }
    const startIndex = BigNumber.from(buf.slice(0, 32)).toString();
    const startSubtrees = [], leaves = [];
    for (let i = 1; i < 21; i++) {
        startSubtrees.push(BigNumber.from(
            buf.slice(i * 32, (i * 32) + 32)
        ).toString());
    }
    for (let i = 21; i < 37; i++) {
        leaves.push(BigNumber.from(
            buf.slice(i * 32, (i * 32) + 32)
        ).toString());
    }

    try {
        const {
            proof,
            publicSignals,
            solidityInput: { newRoot, newSubtrees, p }
        } = await fullProvePoseidon({
            zkeyFileName,
            wasmFileName,
            startIndex,
            startSubtrees,
            leaves
        });
        if (!(await verifyProof({
            proof,
            publicSignals,
            verifierJson
        }))) {
            res.status(500).json({
                error: `failed: invalid proof`
            });
        } else {
            res.status(200).json({
                data: {
                    newRoot: newRoot.toString(),
                    newSubtrees: newSubtrees.map(s => s.toString()),
                    p: p.map(s => s.toString())
                }
            });
        };
        console.timeEnd(`poseidonMassUpdate ${t}`);
    } catch(err) {
        console.log(err);
        res.status(500).json({
            error: 'something went wrong'
        });
    }
}
