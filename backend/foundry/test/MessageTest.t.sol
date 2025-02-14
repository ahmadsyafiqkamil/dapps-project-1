// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/Message.sol";

// contract MessageTest is Test {
//     Message private message;

//     function setUp() public {
//         message = new Message(); // Deploy smart contract
//     }

//     function testSetAndGetMessage() public {
//         // Set pesan baru
//         string memory newMessage = "Hello, Web3!";
//         message.setMessage(newMessage);
        
//         // Ambil pesan dan cek apakah sesuai
//         string memory retrievedMessage = message.getMessage();
//         assertEq(retrievedMessage, newMessage, "Pesan tidak sesuai");
//     }
// }

contract MessageTest is Test{
    Message private message;
    function setUp() public{
        message = new Message();
    }

    function testSetAndGetMessages() public {
        string memory newMessage = "hello, Web3";
        message.setMessage(newMessage);

        string memory retrivedMessage = message.getLastMessage();
        assertEq(retrivedMessage, newMessage,"pesan terakhir tidak sesuai");

        string[] memory allMessages = message.getAllMessages();
        assertEq(allMessages.length, 1,"jumlah tidak sesuai");
        assertEq(keccak256(abi.encodePacked(allMessages[0])),keccak256(abi.encodePacked(newMessage)),"pesan dalam array tidak sesuai");
    }

    function testGetMessageCount() public {
        uint initialCount = message.getMessageCount();
        assertEq(initialCount, 0, "Jumlah pesan awal harus 0");

        message.setMessage("test message 1");
        message.setMessage("test message 3");

        uint finalCount = message.getMessageCount();
        assertEq(finalCount, 2,"Jumlah pesan tidak sesuai setelah penambahan");
    }
}