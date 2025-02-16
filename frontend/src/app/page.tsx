"use client"

import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [newMessage, setNewMessage] = useState("");
  const [lastMessage, setLastMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [messageCount, setMessageCount] = useState(0);

  const API_BASE_URL = "http://127.0.0.1:8000"; // Replace with your FastAPI backend URL

  // Fetch the last message
  const fetchLastMessage = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-last-message`);
      setLastMessage(response.data.last_message);
    } catch (error) {
      console.error("Error fetching the last message:", error);
    }
  };

  // Fetch all messages
  const fetchAllMessages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-all-messages`);
      setAllMessages(response.data.messages);
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
    try {
      // Log URL dan data yang akan dikirim
      console.log("URL:", `${API_BASE_URL}/set-message`);
      console.log("Data yang dikirim:", { new_message: newMessage });
  
      await axios.post(`${API_BASE_URL}/set-message`, { new_message: newMessage });
      setNewMessage("");
      fetchLastMessage();
      fetchAllMessages();
      fetchMessageCount();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  

  useEffect(() => {
    fetchLastMessage();
    fetchAllMessages();
    fetchMessageCount();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Web3 Messaging DApp</h1>

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
