// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "forge-std/Script.sol";
import "../src/ProofOfEscape.sol";

contract DeployProofOfEscape is Script {
    function run() external {
        address token = vm.envAddress("ESCAPE_TOKEN_ADDRESS");
        uint256 pk = vm.envUint("PRIVATE_KEY");

        require(token != address(0), "ESCAPE_TOKEN_ADDRESS is zero");

        console2.log(" Deploying ProofOfEscape with:");
        console2.log("   token:  ", token);

        vm.startBroadcast(pk);
        ProofOfEscape poe = new ProofOfEscape(token);
        vm.stopBroadcast();

        console2.log(" ProofOfEscape deployed at:", address(poe));
        console2.log("   Owner (msg.sender at deploy):", poe.owner());
    }
}
