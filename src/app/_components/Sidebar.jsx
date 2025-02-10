"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function Sidebar() {
  const router = useRouter();
  const [chats, setChats] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;

    const fetchChats = async () => {
      try {
        const response = await axios.get("/api/chats", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        setChats(response.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, [session]);

  const handleNewChat = () => {
    router.push("/"); // إعادة التوجيه إلى الصفحة الرئيسية بدون محادثة
  };

  const handleChatClick = (chatId) => {
    router.push(`/chat/${chatId}`); // التوجيه إلى صفحة الشات المحددة
  };

  return (
    <div className="w-64 h-screen bg-neutral-900 text-white p-4">
      <button
        onClick={handleNewChat}
        className="w-1/2 bg-buttonColor p-2 rounded-xl mb-4 hover:bg-blue-500"
      >
        + New Chat
      </button>
      <h2 className="text-xl font-bold mb-4">Chats</h2>
      <ul>
        {chats.map((chat) => (
          <li key={chat.id} className="mb-2">
            <button
              onClick={() => handleChatClick(chat.id)}
              className="w-full p-2 bg-transparent rounded hover:bg-neutral-700 text-left text-sm"
            >
              {chat.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
