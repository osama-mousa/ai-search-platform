"use client";
import { useRouter } from "next/navigation";

export default function Sidebar({ chats, setCurrentChat }) {
  const router = useRouter();

  const handleNewChat = () => {
    setCurrentChat(null);
    router.push("/"); // إعادة تعيين الصفحة الرئيسية بدون محادثة
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-4">
      <button
        onClick={handleNewChat}
        className="w-full bg-blue-600 p-2 rounded mb-4 hover:bg-blue-500"
      >
        + New Chat
      </button>
      <h2 className="text-xl font-bold mb-4">Chats</h2>
      <ul>
        {chats.map((chat) => (
          <li key={chat.id} className="mb-2">
            <button
              onClick={() => setCurrentChat(chat)}
              className="w-full p-2 bg-gray-800 rounded hover:bg-gray-700 text-left"
            >
              {chat.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
