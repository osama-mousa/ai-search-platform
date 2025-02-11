"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter, useParams, redirect } from "next/navigation";
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

    if (!session) redirect("/sign_in");

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
        setMessages(response.data.messages || []);
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
        { content: message },
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

  const updateMessage = async (messageId, newContent) => {
    try {
      const res = await axios.put(
        `/api/chats/${chatId}`,
        { messageId, content: newContent },
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      if (res.data.updatedMessage) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId ? res.data.updatedMessage : msg
          )
        );
      }
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await axios.delete(`/api/chats/${chatId}`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
        data: { messageId },
      });

      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageId)
      );
    } catch (error) {
      console.error("Error deleting message:", error);
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
              <div className="max-w-3xl justify-center flex w-full transform">
                <div className="bg-transparent  p-4 flex flex-col space-y-2 w-full rounded-xl h-full overflow-auto">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-2 bg-inputColor rounded-xl flex justify-center items-center"
                    >
                      <p className="flex-1">{msg.content}</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateMessage(msg.id, "رسالة معدلة")}
                          className="text-blue-500"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => deleteMessage(msg.id)}
                          className="text-red-500"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-3xl mx-auto mt-64 text-center font-bold text-3xl m-10">
              <h1>Loading chat...</h1>
            </div>
          )}

          <div
            className={`fixed bottom-0 left-[calc(50%+8rem)] transform -translate-x-1/2 mb-10 w-full max-w-3xl bg-white dark:bg-inputColor p-4 rounded-3xl shadow-md flex justify-center`}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage(); // إرسال الرسالة عند الضغط على Enter
                }
              }}
              className="flex-1 p-2 rounded bg-gray-100 dark:bg-transparent focus:outline-none"
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="ml-2 w-8 h-8 rounded-full bg-white text-white flex items-center justify-center hover:bg-neutral-300"
            >
              <IoArrowUp className="w-6 h-6 text-neutral-900" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
