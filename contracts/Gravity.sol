// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Stars.sol";

contract Gravity is ERC20 {
    address public stars_contract;

    mapping(uint256 => uint256) private _tokens;

    constructor() ERC20("StarsCrowding Gravity", "SCG") {
        stars_contract = 0xF2E805A8773e991CDEe1A7e44E54Eb238F2A2f07;
    }

    function decimals() public view virtual override returns (uint8) {
        return 6; // graviton
    }

    function mining(uint256 token) virtual public {
        uint256 balance = Stars(stars_contract).balanceOf(msg.sender, token);
        require(balance > 0, "You need to have Star tokens");
        uint256 timestamp = _tokens[token] > 0 ? _tokens[token] : token;
        uint256 gravitons = (block.timestamp - timestamp) * balance / 10**6;
        require(gravitons > 0);
        _tokens[token] = timestamp + gravitons;
        _mint(msg.sender, gravitons);
    }

    function burn(uint256 amount) virtual public {
        _burn(msg.sender, amount);
    }
}