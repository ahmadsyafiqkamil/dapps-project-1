// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


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
