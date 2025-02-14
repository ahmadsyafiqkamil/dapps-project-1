from fastapi import FastAPI, HTTPException
from web3 import Web3
import os
from dotenv import load_dotenv

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
        "name": "getMessage",
        "outputs": [{"internalType": "string", "name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function",
    },
]

# Initialize contract
contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)

# FastAPI app
app = FastAPI()

# Wallet address
account = w3.eth.account.from_key(PRIVATE_KEY)
wallet_address = account.address

@app.get("/")
def home():
    return {"message": "Web3 + FastAPI API is running!"}

@app.get("/get-message")
def get_message():
    try:
        message = contract.functions.getMessage().call()
        return {"message": message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/set-message")
def set_message(new_message: str):
    try:
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

