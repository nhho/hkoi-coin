// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./Access.sol";
import "./Coin.sol";

contract Quiz {
    Access access;
    Coin coin;
    mapping(address => bool) answeredQuestionOne;
    mapping(address => bool) answeredQuestionTwo;
    mapping(address => bool) answeredQuestionThree;
    mapping(address => uint256) answeredQuestionFour;
    mapping(address => bool) answeredQuestionFive;
    uint256 constant doYouKnowWhereToFindMe = 3434218952321;

    constructor(address accessAddr, address coinAddr) {
        access = Access(accessAddr);
        coin = Coin(coinAddr);
    }

    modifier onlyAdminOrUser() {
        require(access.isAdmin(tx.origin) || access.isUser(tx.origin));
        _;
    }

    function questionOne(uint256 answer) external onlyAdminOrUser {
        require(answer == 1 + 2 + 3);
        require(!answeredQuestionOne[tx.origin]);
        answeredQuestionOne[tx.origin] = true;
        coin.mint(tx.origin, 10 * 1e18);
    }

    function questionTwo(uint256 answer) external onlyAdminOrUser {
        require(answer == doYouKnowWhereToFindMe);
        require(!answeredQuestionTwo[tx.origin]);
        answeredQuestionTwo[tx.origin] = true;
        coin.mint(tx.origin, 20 * 1e18);
    }

    function questionThree(uint256 answer) external onlyAdminOrUser {
        require(answer == block.number);
        require(!answeredQuestionThree[tx.origin]);
        answeredQuestionThree[tx.origin] = true;
        coin.mint(tx.origin, 30 * 1e18);
    }

    function questionFour(uint256 answer) external onlyAdminOrUser {
        bytes32 hash = keccak256(abi.encode(tx.origin, answer));
        uint256 count = 0;
        for (uint256 i = 0; i < 32; i++) {
            if (hash[i] == 0) {
                count++;
            }
        }
        require(count > answeredQuestionFour[tx.origin]);
        coin.mint(
            tx.origin,
            (count - answeredQuestionFour[tx.origin]) * 5 * 1e18
        );
        answeredQuestionFour[tx.origin] = count;
    }

    function questionFive() external onlyAdminOrUser {
        require(msg.sender != tx.origin);
        require(!answeredQuestionFive[tx.origin]);
        answeredQuestionFive[tx.origin] = true;
        coin.mint(tx.origin, 40 * 1e18);
    }
}
