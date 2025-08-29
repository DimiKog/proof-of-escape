// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "forge-std/Script.sol";
import "../src/EscapeToken.sol";

contract TransferOwnershipScript is Script {
    function run() external {
        address escapeTokenAddress = vm.envAddress("ESCAPE_TOKEN_ADDRESS");
        address proofOfEscapeAddress = vm.envAddress("ProofOfEscape_ADDRESS");

        vm.startBroadcast();

        EscapeToken token = EscapeToken(escapeTokenAddress);

        address currentOwner = token.owner();
        console.log("Current owner of EscapeToken:", currentOwner);

        try token.transferOwnership(proofOfEscapeAddress) {
            console.log("Ownership transfer submitted.");
        } catch {
            console.log("Ownership transfer failed.");
        }

        address newOwner = token.owner();
        console.log("Updated owner of EscapeToken:", newOwner);

        vm.stopBroadcast();
    }
}
