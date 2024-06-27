// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./Access.sol";

contract Sponsor {
    Access access;
    mapping(address => uint256) sponsored;

    constructor(address addr) {
        access = Access(addr);
    }

    function sponsoredAmount(address addr) external view returns (uint256) {
        return sponsored[addr];
    }

    event Received(address, uint256);

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    modifier onlyAdmin() {
        require(access.isAdmin(msg.sender));
        _;
    }

    function withdrawTo(address payable addr, uint256 value)
        external
        onlyAdmin
    {
        addr.transfer(value);
    }

    function sponsorUserUpTo(uint256 value) external onlyAdmin {
        address[] memory users = access.getUsers();
        uint256 numOfUsers = users.length;
        for (uint256 i = 0; i < numOfUsers; i++) {
            address user = users[i];
            uint256 alreadySponsored = sponsored[user];
            if (alreadySponsored < value) {
                payable(user).transfer(value - alreadySponsored);
                sponsored[user] = value;
            }
        }
    }
}
