import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from web3 import Web3
from pydantic import BaseModel
from dotenv import load_dotenv
from eth_account.messages import encode_defunct

# Load environment variables
load_dotenv()

RPC_URL = os.getenv("RPC_URL")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")

# Initialize web3
w3 = Web3(Web3.HTTPProvider(RPC_URL))
if not w3.is_connected():
    raise Exception("Failed to connect to Ethereum node")

# Load smart contract ABI
CONTRACT_ABI = [
    {
        "inputs": [{"internalType": "string", "name": "newMessage", "type": "string"}],
        "name": "setMessage",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "inputs": [],
        "name": "getLastMessage",
        "outputs": [{"internalType": "string", "name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [],
        "name": "getAllMessages",
        "outputs": [{"internalType": "string[]", "name": "", "type": "string[]"}],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [],
        "name": "getMessageCount",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function",
    },
]

# Initialize contract
contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)

# FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # URL Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Wallet address
account = w3.eth.account.from_key(PRIVATE_KEY)
wallet_address = account.address

@app.get("/")
def home():
    return {"message": "Web3 + FastAPI API is running!"}

class AuthRequest(BaseModel):
    signature: str
    address: str

@app.post("/authenticate")
def authenticate(request: AuthRequest):
    try:
        message = "Login to Web3 Messaging DApp"
        message_hash = encode_defunct(text=message)

        recovered_address = w3.eth.account.recover_message(message_hash, signature=request.signature)

        if recovered_address.lower() == request.address.lower():
            return {"status": "success", "message": "Authentication successful"}
        else:
            raise HTTPException(status_code=400, detail="Signature verification failed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/get-last-message")
def get_last_message():
    try:
        # Periksa jumlah pesan
        message_count = contract.functions.getMessageCount().call()
        if message_count == 0:
            return {"last_message": "0"}  # Jika tidak ada data, kirim "0"
        
        # Ambil pesan terakhir
        message = contract.functions.getLastMessage().call()
        return {"last_message": message}
    except Exception as e:
        print("Error fetching the last message:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/get-all-messages")
def get_all_messages():
    try:
        message_count = contract.functions.getMessageCount().call()
        if message_count == 0:
            return {"messages": "0"}  # Jika tidak ada data, kirim "0

        messages = contract.functions.getAllMessages().call()
        return {"messages": messages}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/get-message-count")
def get_message_count():
    try:
        count = contract.functions.getMessageCount().call()
        return {"message_count": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
class MessageRequest(BaseModel):
    new_message: str

@app.post("/set-message")
def set_message(request: MessageRequest):
    try:
        new_message = request.new_message  # Ambil nilai dari JSON
        # Create transaction
        nonce = w3.eth.get_transaction_count(wallet_address)
        transaction = contract.functions.setMessage(new_message).build_transaction({
            "chainId": w3.eth.chain_id,
            "gas": 200000,
            "gasPrice": w3.to_wei("20", "gwei"),
            "nonce": nonce,
        })

        # Sign transaction
        signed_tx = w3.eth.account.sign_transaction(transaction, PRIVATE_KEY)

        # Send transaction
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)

        # Wait for receipt
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        return {"message": "Transaction successful", "tx_hash": tx_hash.hex()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

