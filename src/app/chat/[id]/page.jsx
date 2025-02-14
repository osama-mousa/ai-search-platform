"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter, useParams, redirect } from "next/navigation";
import axios from "axios";
import Header from "@/app/_components/Header";
import Sidebar from "@/app/_components/Sidebar";
import { IoArrowUp } from "react-icons/io5";
import { GrFormEdit } from "react-icons/gr";
import { RiAttachmentLine } from "react-icons/ri";

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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // قم بمعالجة تحميل الملف هنا
      console.log("File uploaded:", file);
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
        <div className="flex justify-center">
          <h1 className="text-xl font-bold">{currentChat?.title}</h1>
        </div>
        <div className="max-w-3xl mx-auto w-full p-4 overflow-y-auto">
          {currentChat ? (
            <div>
              <div className="max-w-3xl justify-center flex w-full transform">
                <div className="bg-transparent p-4 flex flex-col space-y-2 w-full rounded-xl h-full overflow-auto">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="group flex justify-end items-center relative"
                    >
                      <button
                        onClick={() => updateMessage(msg.id, "رسالة معدلة")}
                        className="right-1 text-transparent h-8 w-8 transition-colors duration-200"
                      >
                        <GrFormEdit
                          className="group-hover:text-neutral-400 rounded-full p-1 hover:bg-inputColor"
                          size={30}
                        />
                      </button>
                      <p className="bg-inputColor rounded-3xl p-3 text-right">
                        {msg.content}
                      </p>
                      {/* زر التعديل (يظهر عند التحويم) */}
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
            className={`fixed bottom-0 left-[calc(50%+8rem)] transform -translate-x-1/2 mb-10 w-full max-w-3xl bg-white dark:bg-inputColor p-4 rounded-3xl shadow-md flex justify-center flex-col space-y-4 mt-10`}
          >
            <div className="relative">
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
            </div>

            <div className="flex justify-end space-x-2">
              {/* زر تحميل الملف */}
              <label
                htmlFor="file-upload"
                className="w-8 h-8 group rounded-full bg-transparent flex items-center justify-center hover:bg-neutral-600 cursor-pointer"
              >
                <RiAttachmentLine className="w-6 h-6 text-neutral-400 group-hover:text-neutral-200" />
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>

              {/* زر الإرسال */}
              <button
                onClick={sendMessage}
                disabled={!message.trim()}
                className={`w-8 h-8 rounded-full bg-white text-white flex items-center justify-center hover:bg-neutral-300 ${
                  !message.trim() ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <IoArrowUp className="w-6 h-6 text-neutral-900" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
