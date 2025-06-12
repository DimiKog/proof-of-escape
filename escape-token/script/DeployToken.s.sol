// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/EscapeToken.sol";

contract DeployToken is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);
        EscapeToken token = new EscapeToken(deployer, 10000 ether);
        console.log("Token deployed at:", address(token));
        vm.stopBroadcast();
    }
}
