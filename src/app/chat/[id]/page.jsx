"use client";
import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter, useParams, redirect } from "next/navigation";
import axios from "axios";
import Header from "@/app/_components/Header";
import Sidebar from "@/app/_components/Sidebar";
import { IoArrowUp } from "react-icons/io5";
import { GrFormEdit } from "react-icons/gr";
import { RiAttachmentLine } from "react-icons/ri";
import { PulseLoader } from "react-spinners"; // استيراد Spinner

export default function ChatPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { id: chatId } = useParams();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [textareaHeight, setTextareaHeight] = useState("30px"); // حالة لتتبع ارتفاع textarea

  const textareaRef = useRef(null); // ref للوصول إلى textarea

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
      // إرسال رسالة المستخدم إلى الخادم
      const userMessageResponse = await axios.post(
        `/api/chats/${chatId}`,
        { content: message },
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      if (userMessageResponse.data.newMessage) {
        setMessages((prevMessages) => [
          ...prevMessages,
          userMessageResponse.data.newMessage,
        ]);
      }

      // إرسال رسالة المستخدم إلى الذكاء الاصطناعي
      const aiResponse = await axios.post("/api/ai", { message });

      if (aiResponse.data.response) {
        // حفظ رد الذكاء الاصطناعي في قاعدة البيانات
        const aiMessageResponse = await axios.post(
          `/api/chats/${chatId}`,
          { content: aiResponse.data.response },
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );

        if (aiMessageResponse.data.newMessage) {
          setMessages((prevMessages) => [
            ...prevMessages,
            aiMessageResponse.data.newMessage,
          ]);
        }
      }

      setMessage("");
      setTextareaHeight("100px"); // إعادة تعيين الارتفاع
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

  // تحديث ارتفاع textarea بناءً على المحتوى
  const handleTextareaChange = (e) => {
    setMessage(e.target.value);

    // إعادة تعيين الارتفاع إلى الحد الأدنى أولاً
    e.target.style.height = "30px";

    // حساب الارتفاع الجديد بناءً على المحتوى
    const newHeight = Math.min(e.target.scrollHeight, 300); // الحد الأقصى 300px
    e.target.style.height = `${newHeight}px`;
    setTextareaHeight(`${newHeight}px`);
  };

  return (
    <div className="flex h-screen">
      <Head>
        <title>Chat Platform</title>
        <meta name="description" content="AI-powered chat platform" />
      </Head>
      <div className="flex-1 bg-gray-100 dark:bg-primaryColor text-alertColor dark:text-gray-100 p-2">
        <Header />
        <div className="flex justify-center">
          <h1 className="text-xl font-bold">{currentChat?.title}</h1>
        </div>
        <div className="flex-1 flex-col space-y-4 w-full mb-20 pb-20 h-[calc(100vh-15rem)] overflow-y-auto custom-scrollbar">
          {currentChat ? (
            <div className="max-w-3xl mx-auto w-full h-full">
              <div className="flex flex-col space-y-2 w-full h-full">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`group flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    } items-center relative`}
                  >
                    {msg.role === "user" && (
                      <button
                        onClick={() => updateMessage(msg.id, "رسالة معدلة")}
                        className="right-1 text-transparent h-8 w-8 transition-colors duration-200"
                      >
                        <GrFormEdit
                          className="group-hover:text-neutral-400 rounded-full p-1 hover:bg-inputColor"
                          size={30}
                        />
                      </button>
                    )}
                    <p
                      className={`${
                        msg.role === "user"
                          ? "bg-inputColor rounded-3xl p-3 text-right"
                          : "bg-transparent rounded-3xl p-3 text-left"
                      } shadow-lg`}
                    >
                      {msg.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full max-w-3xl mx-auto mt-64 text-center font-bold text-3xl m-10">
              <PulseLoader color="#4F46E5" size={15} />{" "}
              {/* Spinner بدلاً من النص */}
            </div>
          )}
        </div>

        <div
          className={`fixed bottom-0 left-0 right-0 mb-10 w-full max-w-3xl mx-auto bg-white dark:bg-inputColor p-4 rounded-3xl shadow-md flex justify-center flex-col space-y-1`}
        >
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // منع السلوك الافتراضي (إضافة سطر جديد)
                  sendMessage(); // إرسال الرسالة عند الضغط على Enter
                }
                // إذا كان Shift + Enter، يتم إضافة سطر جديد بشكل طبيعي
              }}
              className="flex-1 rounded bg-gray-100 dark:bg-transparent focus:outline-none w-full custom-scrollbar resize-none"
              style={{
                minHeight: "10px", // الحد الأدنى للارتفاع
                maxHeight: "300px", // الحد الأقصى للارتفاع
                height: textareaHeight, // الارتفاع الحالي
                overflowY: "auto", // إظهار شريط التمرير عند الحاجة
              }}
              placeholder="Message Dinosaur"
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
  );
}
