// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/Message.sol";

contract MessageTest is Test {
    Message private message;

    function setUp() public {
        message = new Message(); // Deploy smart contract
    }

    function testSetAndGetMessage() public {
        // Set pesan baru
        string memory newMessage = "Hello, Web3!";
        message.setMessage(newMessage);
        
        // Ambil pesan dan cek apakah sesuai
        string memory retrievedMessage = message.getMessage();
        assertEq(retrievedMessage, newMessage, "Pesan tidak sesuai");
    }
}
