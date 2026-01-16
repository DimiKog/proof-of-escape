// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "forge-std/Script.sol";
import "../src/EscapeToken.sol";
import "../src/ProofOfEscapev3.sol";
import "../src/PoEQuizRewardNFT.sol";

contract DeployAll is Script {
    function run() external {
        // Load the key as bytes32 from the environment (e.g., PRIVATE_KEY="0x...")
        // NOTE: vm.envBytes32 is typically used for hex-formatted keys.
        bytes32 deployerKeyBytes = vm.envBytes32("PRIVATE_KEY");

        // Use vm.addr() to derive the deployer address from the key
        address deployer = vm.addr(uint256(deployerKeyBytes));

        // Start broadcast using the key (converted to uint256 for vm.startBroadcast)
        vm.startBroadcast(uint256(deployerKeyBytes));

        // Step 1: Deploy EscapeToken with initial owner and supply
        EscapeToken token = new EscapeToken(deployer, 1_000_000 ether);

        // Step 2: Deploy PoEQuizRewardNFT
        PoEQuizRewardNFT nft = new PoEQuizRewardNFT();

        // Step 3: Deploy ProofOfEscape, passing token address
        ProofOfEscape poe = new ProofOfEscape(address(token));

        // Step 4: Transfer ownerships from the deployer to ProofOfEscape
        token.transferOwnership(address(poe));
        nft.transferOwnership(address(poe));

        vm.stopBroadcast();

        // Logs
        console.log("Deployment Successful!");
        console.log("EscapeToken deployed at:", address(token));
        console.log("PoEQuizRewardNFT deployed at:", address(nft));
        console.log("ProofOfEscape deployed at:", address(poe));
        console.log("Deployer address:", deployer);
    }
}
