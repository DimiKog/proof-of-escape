// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "forge-std/Script.sol";
import "../src/ProofOfEscape.sol";

contract DeployProofOfEscape is Script {
    function run() external {
        address token = vm.envAddress("ESCAPE_TOKEN_ADDRESS");
        uint256 reward = vm.envUint("REWARD_PER_QUIZ");
        uint256 pk = vm.envUint("PRIVATE_KEY");

        require(token != address(0), "ESCAPE_TOKEN_ADDRESS is zero");
        require(reward > 0, "REWARD_PER_QUIZ must be > 0");

        console2.log(" Deploying ProofOfEscape with:");
        console2.log("   token:  ", token);
        console2.log("   reward: ", reward);

        vm.startBroadcast(pk);
        ProofOfEscape poe = new ProofOfEscape(token, reward);
        vm.stopBroadcast();

        console2.log(" ProofOfEscape deployed at:", address(poe));
        console2.log("   Owner (msg.sender at deploy):", poe.owner());
    }
}
