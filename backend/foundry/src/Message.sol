// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Message {
    // Variable untuk menyimpan pesan
    string private message;

    // Event untuk mencatat perubahan pesan
    event MessageUpdated(string oldMessage, string newMessage);

    // Fungsi untuk mengatur pesan
    function setMessage(string memory newMessage) public {
        string memory oldMessage = message;
        message = newMessage;
        emit MessageUpdated(oldMessage, newMessage);
    }

    // Fungsi untuk mengambil pesan
    function getMessage() public view returns (string memory) {
        return message;
    }
}
