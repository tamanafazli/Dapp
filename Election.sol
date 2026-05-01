// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Election {

    uint public candidatesCount;

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public voters;

    constructor() {
        candidatesCount = 0;
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    function addCandidate(string memory _name) public {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote(uint _candidateId) public {
        require(!voters[msg.sender], "You have already voted");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate");

        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;
    }

    function getCandidate(uint _id) public view returns (uint, string memory, uint) {
        Candidate memory c = candidates[_id];
        return (c.id, c.name, c.voteCount);
    }
}