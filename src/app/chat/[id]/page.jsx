"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Header from "@/app/_components/Header";
import Sidebar from "@/app/_components/Sidebar";
import { IoArrowUp } from "react-icons/io5";

export default function ChatPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { id: chatId } = useParams();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  useEffect(() => {
    if (!chatId) {
      setCurrentChat(null);
      setMessages([]);
      return;
    }
    const fetchChat = async () => {
      try {
        const response = await axios.get(`/api/chats/${chatId}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        setCurrentChat(response.data);
        setMessages(response.data.content || []);
      } catch (error) {
        console.error("Error fetching chat:", error);
      }
    };
    fetchChat();
  }, [chatId]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      const res = await axios.post(
        `/api/chats/${chatId}`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      if (res.data.newMessage) {
        setMessages((prevMessages) => [...prevMessages, res.data.newMessage]);
      }
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex h-screen">
      <Head>
        <title>Chat Platform</title>
        <meta name="description" content="AI-powered chat platform" />
      </Head>
      <div className="flex-1 flex flex-col bg-gray-100 dark:bg-primaryColor text-alertColor dark:text-gray-100 p-2">
        <Header />
        <div className="flex-1 p-4 overflow-y-auto">
          {currentChat ? (
            <div>
              <h1 className="text-2xl font-bold">
                {currentChat.title || "New Chat"}
              </h1>
              <div className="bg-transparent p-4 rounded h-96 overflow-y-auto">
                {messages.map((msg, index) => (
                  <p key={index} className="p-2 bg-white rounded mb-2">
                    {msg.content}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full max-w-3xl mx-auto mt-64 text-center font-bold text-3xl m-10">
              <h1>Loading chat...</h1>
            </div>
          )}

          <div
            className={`w-full max-w-3xl mx-auto bg-white dark:bg-inputColor p-4 rounded-3xl shadow-md relative flex`}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 p-2 rounded bg-gray-100 dark:bg-transparent focus:outline-none"
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-white text-white flex items-center justify-center hover:bg-neutral-300"
            >
              <IoArrowUp className="w-6 h-6 text-neutral-900" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
