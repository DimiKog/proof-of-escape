// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "forge-std/Script.sol";
import {PoEQuizRewardNFT} from "../src/PoEQuizRewardNFT.sol";

contract MintPoEQuizReward is Script {
    function run() external {
        // Load admin private key from .env
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address recipient = vm.addr(deployerPrivateKey); // Admin wallet address

        // Broadcast the transaction
        vm.startBroadcast(deployerPrivateKey);

        // Reference deployed contract address
        PoEQuizRewardNFT nft = PoEQuizRewardNFT(
            payable(0x095dbc84D218695B09Ab6Ac662C11C8312621ed5)
        );

        // Mint the reward NFT to admin wallet
        nft.mintReward(recipient);

        vm.stopBroadcast();
    }
}
