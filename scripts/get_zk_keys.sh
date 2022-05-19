#!/usr/bin/env bash

wget \
    https://storageapi.fleek.co/10fd7cca-1427-4b72-9cd1-d81b5da792dd-bucket/update.wasm \
    -O ./src/zk-stuff/update.wasm

wget \
    https://storageapi.fleek.co/10fd7cca-1427-4b72-9cd1-d81b5da792dd-bucket/update_verifier.json \
    -O ./src/zk-stuff/updateVerifier.json

wget \
    https://storageapi.fleek.co/10fd7cca-1427-4b72-9cd1-d81b5da792dd-bucket/update_final.zkey \
    -O ./src/zk-stuff/update.zkey

wget \
    https://storageapi.fleek.co/10fd7cca-1427-4b72-9cd1-d81b5da792dd-bucket/mass_update.wasm \
    -O ./src/zk-stuff/massUpdate.wasm

wget \
    https://storageapi.fleek.co/10fd7cca-1427-4b72-9cd1-d81b5da792dd-bucket/mass_update_verifier.json \
    -O ./src/zk-stuff/massUpdateVerifier.json

wget \
    https://storageapi.fleek.co/10fd7cca-1427-4b72-9cd1-d81b5da792dd-bucket/mass_update_final.zkey \
    -O ./src/zk-stuff/massUpdate.zkey