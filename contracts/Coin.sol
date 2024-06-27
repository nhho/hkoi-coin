// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "./Access.sol";

contract Coin is ERC20Pausable {
    Access access;

    constructor(address addr) ERC20("HKOI Coin", "HKOI") {
        access = Access(addr);
    }

    modifier onlyAdmin() {
        require(access.isAdmin(msg.sender));
        _;
    }

    function mint(address addr, uint256 value) external onlyAdmin {
        _mint(addr, value);
    }

    function batchMint(address[] calldata addrs, uint256[] calldata values)
        external
        onlyAdmin
    {
        uint256 numOfUsers = addrs.length;
        require(numOfUsers == values.length);
        for (uint256 i = 0; i < numOfUsers; i++) {
            _mint(addrs[i], values[i]);
        }
    }

    function pause() external onlyAdmin {
        _pause();
    }

    function unpause() external onlyAdmin {
        _pause();
    }
}
