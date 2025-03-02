# Web3 Messaging DApp

## Description
This project is a Web3-based messaging application that allows users to store and retrieve messages on the blockchain. The application is built using the following technologies:

- **Foundry** for smart contract development
- **FastAPI** for the backend API
- **Next.js** for the frontend interface

The purpose of this project is to serve as a learning experience for me as I transition into Web3 development.

## Features
- Store messages on the blockchain
- Retrieve the last stored message
- Fetch all stored messages
- Authenticate users via MetaMask
- Connect with a FastAPI backend

## Technologies Used
- **Solidity** (Smart contract development)
- **Foundry** (Smart contract testing & deployment)
- **FastAPI** (Backend API for interacting with the blockchain)
- **Web3.py** (Ethereum blockchain interaction)
- **Next.js** (Frontend framework for UI)
- **Ethers.js** (Ethereum blockchain interaction on the frontend)

## Smart Contract (Solidity)
The smart contract manages message storage on the Ethereum blockchain.

```solidity
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
```

## Backend (FastAPI)
The FastAPI backend interacts with the Ethereum blockchain using Web3.py.

### Endpoints:
- `GET /` - Home route to check API status
- `POST /authenticate` - Authenticate users via MetaMask signature
- `GET /get-last-message` - Retrieve the last stored message
- `GET /get-all-messages` - Retrieve all stored messages
- `GET /get-message-count` - Get the count of stored messages
- `POST /set-message` - Store a new message on the blockchain

## Frontend (Next.js)
The Next.js frontend provides an interface for interacting with the smart contract.

### Features:
- Connect MetaMask to authenticate users
- Send messages to the blockchain
- View stored messages
- Display the count of stored messages

## Setup Instructions
### Prerequisites:
- Node.js & npm
- Python 3
- Foundry (for smart contract development)
- MetaMask browser extension

### Steps:
1. **Clone the repository**
   ```sh
   git clone <repository-url>
   cd web3-messaging-dapp
   ```
2. **Set up Smart Contracts**
   ```sh
   forge build
   forge test
   ```
3. **Deploy Smart Contract**
   ```sh
   forge script script/Deploy.s.sol --rpc-url <RPC_URL> --private-key <PRIVATE_KEY> --broadcast
   ```
4. **Set up Backend**
   ```sh
   cd backend
   python -m venv venv
   source venv/bin/activate  # For Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env  # Update .env with your values
   uvicorn main:app --reload
   ```
5. **Set up Frontend**
   ```sh
   cd frontend
   npm install
   npm run dev
   ```
6. **Interact with the DApp**
   - Open `http://localhost:3000`
   - Connect MetaMask
   - Store & Retrieve messages

## License
This project is licensed under the MIT License.

