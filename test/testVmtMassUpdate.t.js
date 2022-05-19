const axios = require('axios');
const { unsafeRandomLeaves, zeros } = require('vmtjs').utils;

async function main() {
    return await axios.post(
        "http://localhost:8080/vmtMassUpdate",
        {
            data: {
                leaves: unsafeRandomLeaves(10).map(n => n.toHexString()),
                startIndex: 0,
                filledSubtrees: zeros.slice(0, 20)
            }
        }
    );
}

main().then(response => {
    console.log("proof", response.data.proof);
    console.log("newFilledSubtrees", response.data.newFilledSubtrees);
}).catch(console.error);