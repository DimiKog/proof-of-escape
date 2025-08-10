// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "forge-std/Script.sol";
import "../src/EscapeToken.sol";

/// Deploys EscapeToken with:
/// - INITIAL_OWNER: address that will own the token (and receive initialSupply)
/// - INITIAL_SUPPLY_WEI: initial supply in wei (use 0 if you want PoE to mint everything)
/// - PRIVATE_KEY: deployer EOA's private key (used to broadcast the tx)
contract DeployEscapeToken is Script {
    function run() external {
        // ---- Read env vars ----
        address initialOwner = vm.envAddress("SENDER");
        uint256 initialSupplyWei = vm.envUint("INITIAL_SUPPLY_WEI");
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");

        // ---- Deploy ----
        vm.startBroadcast(deployerKey);
        EscapeToken token = new EscapeToken(initialOwner, initialSupplyWei);
        vm.stopBroadcast();

        // ---- Logs ----
        console2.log("DONE EscapeToken deployed at:", address(token));
        console2.log("    Owner:", initialOwner);
        console2.log("    Initial supply (wei):", initialSupplyWei);
        console2.log("    Symbol:", token.symbol());
        console2.log("    Name:", token.name());
    }
}
