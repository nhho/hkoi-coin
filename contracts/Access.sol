// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract Access {
    using EnumerableSet for EnumerableSet.AddressSet;

    EnumerableSet.AddressSet admins;
    EnumerableSet.AddressSet users;
    mapping(address => string) userNames;
    mapping(address => string) userTeams;

    constructor() {
        admins.add(msg.sender);
    }

    modifier onlyAdmin() {
        require(admins.contains(msg.sender));
        _;
    }

    function addAdmin(address addr) external onlyAdmin {
        require(admins.add(addr));
    }

    function addUser(
        address addr,
        string calldata name,
        string calldata team
    ) external onlyAdmin {
        require(users.add(addr));
        userNames[addr] = name;
        userTeams[addr] = team;
    }

    function addUsers(
        address[] calldata addrs,
        string[] calldata names,
        string[] calldata teams
    ) external onlyAdmin {
        uint256 numOfUsers = addrs.length;
        require(numOfUsers == names.length && numOfUsers == teams.length);
        for (uint256 i = 0; i < numOfUsers; i++) {
            address addr = addrs[i];
            require(users.add(addr));
            userNames[addr] = names[i];
            userTeams[addr] = teams[i];
        }
    }

    function removeAdmin(address addr) external onlyAdmin {
        require(admins.remove(addr));
    }

    function removeUser(address addr) external onlyAdmin {
        require(users.remove(addr));
        delete userNames[addr];
        delete userTeams[addr];
    }

    function isAdmin(address addr) external view returns (bool) {
        return admins.contains(addr);
    }

    function isUser(address addr) external view returns (bool) {
        return users.contains(addr);
    }

    function isAdminOrUser(address addr) external view returns (bool) {
        return admins.contains(addr) || users.contains(addr);
    }

    function getAdmins() external view returns (address[] memory) {
        return admins.values();
    }

    function getUsers() external view returns (address[] memory) {
        return users.values();
    }

    function getUserDetails()
        external
        view
        returns (
            address[] memory,
            string[] memory,
            string[] memory
        )
    {
        uint256 numOfUsers = users.length();
        string[] memory names = new string[](numOfUsers);
        string[] memory teams = new string[](numOfUsers);
        for (uint256 i = 0; i < numOfUsers; i++) {
            address user = users.at(i);
            names[i] = userNames[user];
            teams[i] = userTeams[user];
        }
        return (users.values(), names, teams);
    }
}
