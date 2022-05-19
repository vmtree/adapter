# Chainlink VMT Adapter
This repository contains external adapters that perform computations for Verifiable Merkle Trees.

## Structure
Adapter logic callable by the chainlink node is contained in [endpoints](./src/endpoints/). The `app.js` file imports and exposes adapter logic at an endpoint matching its name using `camelCase` capitalization.

## Install
```sh
$ git clone https://github.com/vmtree/adapter.git
$ cd adapter
$ yarn
```

## Run
```sh
$ docker-compose up -d
```
Verify the container is up with
```sh
$ docker ps -a 
```

## Send a request
Need to add a js script
