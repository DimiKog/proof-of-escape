// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title PoEQuizRewardNFT
/// @notice ERC-721 NFT reward for users who complete the Proof of Escape quiz
contract PoEQuizRewardNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    // Track if an address has already claimed the NFT
    mapping(address => bool) public hasClaimed;

    // IPFS-hosted metadata URI (e.g. "ipfs://<CID>")
    string public constant rewardTokenURI =
        "ipfs://bafkreigafyxrl7kd4l2i62uw4j2r5den4fev3i7f4kzyssaw32dqjoh4xy";

    constructor() ERC721("Proof of Escape Reward", "POENFT") {}

    /// @notice Mint NFT reward to a user address
    /// @param to The address to receive the NFT
    function mintReward(address to) external onlyOwner {
        require(!hasClaimed[to], "User already claimed reward");
        hasClaimed[to] = true;

        uint256 tokenId = ++_tokenIdCounter;
        _mint(to, tokenId);
        _setTokenURI(tokenId, rewardTokenURI);
    }

    /// @notice Returns the total number of NFTs minted
    function totalMinted() external view returns (uint256) {
        return _tokenIdCounter;
    }
}
