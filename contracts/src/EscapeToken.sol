// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EscapeToken is ERC20, ERC20Burnable, Ownable {
    event TokensMinted(address indexed to, uint256 amount);

    constructor(
        address initialOwner,
        uint256 initialSupply
    ) ERC20("Escape Token", "ESCAPE") {
        _mint(initialOwner, initialSupply);
        _transferOwnership(initialOwner); // Set the actual owner
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }
}
// This contract is an ERC20 token with burnable functionality and ownership control.
