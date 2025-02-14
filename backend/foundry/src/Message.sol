// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// contract Message {
//     // Variable untuk menyimpan pesan
//     string[] private messages;

//     // Event untuk mencatat perubahan pesan
//     event MessageUpdated(string oldMessage, string newMessage);

//     // Fungsi untuk mengatur pesan
//     function setMessage(string memory newMessage) public {
//         string memory oldMessage = message;
//         message = newMessage;
//         emit MessageUpdated(oldMessage, newMessage);
//     }

//     // Fungsi untuk mengambil pesan
//     function getMessage() public view returns (string memory) {
//         return message;
//     }
// }

contract Message {
    string[] private messages;

    event MessageAdded(string newMessage);

    function setMessage(string calldata newMessage) external {
        messages.push(newMessage);
        emit MessageAdded(newMessage);
    }

    function getLastMessage() external view returns(string memory){
        require(messages.length > 0, "No Message Stored");
        return messages[messages.length - 1];
    }
    
    function getAllMessages() external view returns (string[] memory){
        return messages;
    }

    function getMessageCount() external view returns(uint){
        return messages.length;
    }
}
