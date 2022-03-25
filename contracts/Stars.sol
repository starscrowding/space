// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Stars is ERC1155 {
    address public _admin;
    string public _contractUri;
    mapping (uint256 => string) public _uris;

    constructor() ERC1155("") {
        _admin = msg.sender;
    }

    modifier onlyAdmin {
        require(msg.sender == _admin);
        _;
    }

    function contractURI() public view returns (string memory) {
        return _contractUri;
    }

    function setContractURI(string memory _uri) public onlyAdmin {
        _contractUri = _uri;
    }

    function uri(uint256 _id) override public view returns (string memory)  {
        return(_uris[_id]);
    }

    function setTokenUri(uint256 _id, string memory _uri) public onlyAdmin {
        _uris[_id] = _uri;
    }

    function mint(uint256 _id) virtual public onlyAdmin {
        require(bytes(_uris[_id]).length == 0);
        _mint(msg.sender, _id, 10**6, "");
    }

    function burn(uint256 _id, uint256 amount) virtual public {
        _burn(msg.sender, _id, amount);
    }
}
