# Election DApp — Local Setup

This README explains how to run the Election DApp locally on a new machine. The project includes a Truffle/Smart Contract backend, a Node.js Express backend that talks to the contract, and a simple static frontend.

Prerequisites
- Node.js (v16+ recommended) and npm
- Ganache (GUI or CLI) running on port `7545` (development network)
- Truffle (optional; `npx truffle` can be used)

Quick start
1. Start Ganache (GUI or CLI) and ensure it listens on `http://127.0.0.1:7545`.

2. Install project dependencies

From project root (this installs project-level dependencies):

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install express ethers cors
cd ..
```

3. Compile & migrate smart contracts

From the `blockchain` folder run (use `npx` to avoid global install):

```bash
cd blockchain
npx truffle migrate --reset --network development
```

- After successful migration, note the deployed `Election` contract address printed by Truffle.
- You can also open `blockchain/build/contracts/Election.json` and find the deployed address under the `networks` object for your Ganache network id (usually `5777`).

4. Configure backend contract address

Open `backend/server.js` and set `contractAddress` to the deployed contract address from step 3. Example:

```js
// backend/server.js
const contractAddress = "0xYOUR_DEPLOYED_ADDRESS_HERE";
```

5. Start backend server

From the `backend` folder:

```bash
node server.js
# or if you prefer using nodemon:
# npx nodemon server.js
```

The backend listens on `http://localhost:3001` and exposes these endpoints used by the frontend:

- `GET /candidates` — list all candidates
- `POST /vote` — body: `{ candidateId: <number> }` — cast a vote
- `POST /addCandidate` — body: `{ name: <string> }` — add a candidate (writes on-chain)
- `GET /results` — aggregated vote counts

6. Serve frontend

You can open `frontend/index.html` directly in the browser, or serve it with a static server for best behavior (CORS + consistent origin):

```bash
# from project root
npx http-server frontend -p 8080
# then open http://localhost:8080
```

Usage
- Open the frontend in your browser.
- Use the `Add Candidate` box to add new candidates (this calls the backend which writes to the contract).
- To vote, enter the numeric candidate ID and click `Vote`.
- The UI shows inline success/error messages.

Notes & important details
- The frontend stores a `voted` flag in `localStorage` to disable the vote controls after one vote in that browser. The smart contract itself enforces one vote per wallet address.
- If you get a deployment error (e.g., `invalid opcode`), ensure Ganache is running and `truffle-config.js` network matches Ganache (host/port). Also ensure your Solidity pragma is compatible with the compiler in `truffle-config.js`.
- If you prefer not to edit `backend/server.js` manually, you can read the deployed address from `blockchain/build/contracts/Election.json` and programmatically set it in the server before starting.

Troubleshooting
- `VM Exception while processing transaction: invalid opcode` — usually caused by contract revert during construction or call. Check:
  - Ganache is running at the correct port (7545)
  - Compiler version in `truffle-config.js` matches `pragma` in your `.sol` files
  - If constructor runs external calls, ensure called functions are available and don't revert

- `Error: listen EADDRINUSE` — port already in use. Change ports or stop the conflicting process.

Useful commands summary

```bash
# install deps
npm install
npm install --prefix backend express ethers cors

# migrate contracts
cd blockchain
npx truffle migrate --reset --network development

# start backend
cd backend
node server.js

# serve frontend
npx http-server ../frontend -p 8080
```

If you want help automating the contract address injection into `backend/server.js` or a small `.env`-based configuration, I can add that next.

Enjoy — and let me know if you want a one-click script to start Ganache, migrate, run the backend, and serve the frontend.
