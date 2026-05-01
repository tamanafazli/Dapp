const express = require("express");
const { ethers } = require("ethers");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 🔗 Connect to Ganache
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545");

// contract address
const contractAddress = "0x7974c2d0D3180c24342bfb8f090270a920a1dD77";

// Paste ABI from Election.json
const contractABI = require("../blockchain/build/contracts/Election.json").abi;

// Connect signer
const signer = provider.getSigner(0);

// Create contract instance
const contract = new ethers.Contract(contractAddress, contractABI, signer);


// 📌 GET ALL CANDIDATES
app.get("/candidates", async (req, res) => {
    try {
        const count = await contract.candidatesCount();
        let candidates = [];

        for (let i = 1; i <= count; i++) {
            const candidate = await contract.candidates(i);
            candidates.push({
                id: candidate.id.toString(),
                name: candidate.name,
                votes: candidate.voteCount.toString()
            });
        }

        res.json(candidates);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


// 📌 VOTE
app.post("/vote", async (req, res) => {
    try {
        const { candidateId } = req.body;

        const tx = await contract.vote(candidateId);
        await tx.wait();

        res.send("Vote successful");
    } catch (err) {
        res.status(500).send(err.message);
    }
});


// 📌 ADD CANDIDATE
app.post("/addCandidate", async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) return res.status(400).send('Name is required');

        const tx = await contract.addCandidate(name);
        await tx.wait();

        res.json({ message: 'Candidate added', txHash: tx.hash });
    } catch (err) {
        res.status(500).send(err.message);
    }
});


// 📌 GET RESULTS
app.get("/results", async (req, res) => {
    try {
        const count = await contract.candidatesCount();
        let results = [];

        for (let i = 1; i <= count; i++) {
            const candidate = await contract.candidates(i);
            results.push({
                name: candidate.name,
                votes: candidate.voteCount.toString()
            });
        }

        res.json(results);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


// Start server
app.listen(3001, () => {
    console.log("Backend running on http://localhost:3001");
});