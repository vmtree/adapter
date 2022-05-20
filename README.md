# Chainlink VMT Adapter
This repository contains an external adapter that performs computations for Verifiable Merkle Trees.  In the alpha release of VMTree, the external adapter's Docker container sits alongside the Chainlink and Postgres containers on a given host.  

## Architecture 
![Diagram](/images/diagram.png)

## Structure
Adapter logic callable by the chainlink node is contained in [endpoints](./src/endpoints/). The `app.js` file imports and exposes adapter logic at an endpoint matching its name using `camelCase` capitalization, however it is still a module. The actual server is started in `index.js`. We can specify a custom port by setting the `VMT_ADAPTER_PORT` environment variable in `.env`, or else it will use the default port `8080`. Note that if you alter the adapter port, then the docker-compose file needs to be modified as well.

## Install
This adapter runs in docker. We use docker to take advantage of networking with the chainlink node, because we use this adapter on the same machine as our chainlink node that is also running in a docker container.

1. Clone the repository.
```sh
$ git clone https://github.com/vmtree/adapter.git
$ cd adapter
```

2. Download the zero knowledge proving/verifying keys and the wasm circuits for generating proofs. Run the shell script in [scripts](./scripts/). You may have to alter the permissions of the file to get it to run on your machine.
```sh
$ ./scripts/get_zk_keys.sh
```
The above command will populate [/src/zk-stuff](./src/zk-stuff/) with the necessary files for generating and verifying zero knowledge proofs for VMTrees:
```sh
# expected contents of zk-stuff after running script
.gitignore
massUpdateVerifier.json
massUpdate.wasm
massUpdate.zkey
updateVerifier.json
update.wasm
update.zkey
```
If you don't download these files, then the adapter will not work.

3. Build the image.
```sh
$ docker-compose build
```

## Run
```sh
$ docker-compose up -d
```
Verify the container is up with
```sh
$ docker ps -a 
```


## Testing locally
You can test locally without using docker. Follow steps 1-2 from above to install the code and the zk keys.
1. Install the app locally using yarn/npm.
```sh
$ yarn
```
or
```sh
$ npm install
```

2. Start the development server.
```sh
$ npx nodemon
```

3. Now, in a second terminal window or tab, send a request to either endpoint.
```sh
$ node test/testVmtUpdate.t.js
```

```sh
$ node test/testVmtMassUpdate.t.js
```
