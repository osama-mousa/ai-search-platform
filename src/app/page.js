"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Header from "@/app/_components/Header";
import Sidebar from "./_components/Sidebar";
import { IoArrowUp } from "react-icons/io5";
import Footer from "./_components/Footer";
import { RiAttachmentLine } from "react-icons/ri";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  if (!session) redirect("/sign_in");

  useEffect(() => {
    if (!chatId) {
      setCurrentChat(null);
      return;
    }
    const fetchChat = async () => {
      try {
        const response = await axios.get(`/api/chats/${chatId}`);
        setCurrentChat(response.data);
      } catch (error) {
        console.error("Error fetching chat:", error);
      }
    };
    fetchChat();
  }, [chatId]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      if (!currentChat) {
        // إنشاء محادثة جديدة
        const res = await axios.post(
          "/api/chats",
          { message },
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        const { chatId, chat } = res.data;
        setChats((prevChats) => [chat, ...prevChats]);
        setCurrentChat(chat);
        router.replace(`/chat/${chatId}`);
      } else {
        // إرسال رسالة داخل المحادثة الحالية
        const res = await axios.post(`/api/chats/${currentChat.id}`, {
          message,
        });
        if (res.data.newMessage) {
          setCurrentChat((prev) => ({
            ...prev,
            content: [...prev.content, res.data.newMessage],
          }));
        }
      }
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
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
        <div className="flex-1 flex flex-col justify-center items-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl text-center font-bold">
            <h1 className="text-lg md:text-3xl">What are you looking for?</h1>
          </div>
          <div
            className={`w-full max-w-3xl bg-white dark:bg-inputColor p-4 rounded-3xl shadow-md flex flex-col space-y-4 mt-10`}
          >
            {/* حقل الإدخال */}
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
                className="w-full p-2 rounded bg-gray-100 dark:bg-transparent focus:outline-none"
                placeholder="Message Dinosaur"
              />
            </div>

            {/* الأزرار */}
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
