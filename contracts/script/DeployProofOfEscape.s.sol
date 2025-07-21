// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "forge-std/Script.sol";
import "../src/ProofOfEscape.sol";

contract DeployProofOfEscape is Script {
    function run() external {
        // Replace this with the actual deployed EscapeToken address
        address escapeTokenAddress = vm.envAddress("ESCAPE_TOKEN_ADDRESS");

        vm.startBroadcast();
        new ProofOfEscape(escapeTokenAddress);
        vm.stopBroadcast();
    }
}
