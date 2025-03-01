"use client"

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";

export default function Home() {
  const [newMessage, setNewMessage] = useState("");
  const [lastMessage, setLastMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [messageCount, setMessageCount] = useState(0);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const API_BASE_URL = "http://127.0.0.1:8000"; // Ganti dengan URL backend FastAPI

  // Fungsi untuk login dengan MetaMask
  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
        console.log("Connected address:", address);
      } catch (error) {
        console.error("User denied account access or error occurred:", error);
      }
    } else {
      alert("MetaMask is not installed!");
    }
  };

  // Fetch the last message
  const fetchLastMessage = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-last-message`);
      const message = response.data.last_message;
      setLastMessage(message === "0" ? "No messages available" : message);
    } catch (error) {
      console.error("Error fetching the last message:", error);
      setLastMessage("Error fetching data");
    }
  };

  // Fetch all messages
  const fetchAllMessages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-all-messages`);
      setAllMessages(response.data.messages !== "0" ? response.data.messages : []);
    } catch (error) {
      console.error("Error fetching all messages:", error);
    }
  };

  // Fetch message count
  const fetchMessageCount = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-message-count`);
      setMessageCount(response.data.message_count);
    } catch (error) {
      console.error("Error fetching message count:", error);
    }
  };

  // Send a new message
  const sendMessage = async () => {
    if (!walletAddress) {
      alert("Please connect your MetaMask wallet first.");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/set-message`, { new_message: newMessage });
      setNewMessage("");
      fetchLastMessage();
      fetchAllMessages();
      fetchMessageCount();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const authenticateUser = async () => {
    if (!window.ethereum) {
      alert("MetaMask not installed!");
      return;
    }
  
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
  
      const message = "Login to Web3 Messaging DApp";
      const signature = await signer.signMessage(message);
  
      const response = await axios.post(`${API_BASE_URL}/authenticate`, {
        signature: signature, 
        address: address,
      });
  
      if (response.data.status === "success") {
        setWalletAddress(address);
        localStorage.setItem("walletAddress", address);
        alert("Authentication successful!");
      } else {
        alert("Authentication failed!");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      alert("Authentication failed!");
    }
  };

  const logout = () =>{
    localStorage.removeItem("walletAddress");
    setWalletAddress(null);
    alert("Logged out successfully")
  }
  
  

  useEffect(() => {
    fetchLastMessage();
    fetchAllMessages();
    fetchMessageCount();
    const savedAddress = localStorage.getItem("walletAddress");
    if(savedAddress){
      setWalletAddress(savedAddress);
    }
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Web3 Messaging DApp</h1>

      <div className="mb-4">
        {walletAddress ? (
          <div>
          <p className="text-green-600">Connected: {walletAddress}</p>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded mt-2"
          >
            Logout
          </button>
        </div>
        ) : (
          <button onClick={authenticateUser} className="bg-green-500 text-white px-4 py-2 rounded">
            Login with MetaMask
          </button>
        )}
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Send Message
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Last Message</h2>
        <p className="border p-2 rounded bg-gray-100">{lastMessage}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">All Messages</h2>
        <ul className="list-disc pl-5">
          {allMessages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Message Count</h2>
        <p className="border p-2 rounded bg-gray-100">{messageCount}</p>
      </div>
    </div>
  );
}
