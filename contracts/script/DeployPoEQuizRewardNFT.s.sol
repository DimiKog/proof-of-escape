// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "forge-std/Script.sol";
import "../src/PoEQuizRewardNFT.sol";

contract DeployPoEQuizRewardNFT is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        new PoEQuizRewardNFT();

        vm.stopBroadcast();
    }
}
