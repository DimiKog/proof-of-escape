// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "forge-std/Script.sol";
import "../src/ProofOfEscape.sol";

contract SetQuizHash is Script {
    function run() external {
        // Load from environment
        address contractAddress = vm.envAddress("CONTRACT_ADDRESS");

        // Create contract instance
        ProofOfEscape poe = ProofOfEscape(contractAddress);

        // Example values (can be changed for each run)
        uint256 quizId = 1;
        bytes32 hash = 0x73ed9f40e149b6a9906fc4d61f15b502b52b6647c20c18b3b35caa36d00197fe; // keccak256("blockchain")

        vm.startBroadcast();
        poe.setQuizHash(quizId, hash);
        vm.stopBroadcast();
    }
}
