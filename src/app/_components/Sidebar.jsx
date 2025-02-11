"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { FaBars, FaTimes } from "react-icons/fa";
import {
  TbEdit,
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarLeftExpand,
} from "react-icons/tb";

export default function Sidebar() {
  const router = useRouter();
  const { id: chatId } = useParams(); // الحصول على chatId الحالي من الرابط
  const [chats, setChats] = useState([]);
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // حالة الـ Sidebar

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // تبديل حالة الـ Sidebar
  };

  // دالة لتحديد الفترة الزمنية للشات
  const getTimePeriod = (date) => {
    const now = new Date();
    const chatDate = new Date(date);
    const diffInDays = Math.floor((now - chatDate) / (1000 * 60 * 60 * 24));

    if (diffInDays < 1) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays <= 7) return "Previous 7 Days";
    if (diffInDays <= 30) return "Previous 30 Days";

    const month = chatDate.toLocaleString("default", { month: "long" });
    const year = chatDate.getFullYear();

    if (chatDate.getFullYear() === now.getFullYear()) {
      return month; // الشهر الحالي
    } else {
      return `${month} ${year}`; // الشهر والسنة
    }
  };

  // دالة لتجميع الشاتات حسب الفترة الزمنية
  const groupChatsByTimePeriod = (chats) => {
    const groupedChats = {};

    chats.forEach((chat) => {
      const period = getTimePeriod(chat.createdAt);
      if (!groupedChats[period]) {
        groupedChats[period] = [];
      }
      groupedChats[period].push(chat);
    });

    return groupedChats;
  };

  const groupedChats = groupChatsByTimePeriod(chats);

  return (
    <>
      {/* زر فتح الـ Sidebar */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 p-2 text-white rounded-lg z-1"
      >
        <TbLayoutSidebarLeftExpand className="w-7 h-7 text-neutral-400" />
      </button>

      {/* الـ Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 h-screen bg-neutral-900 text-white p-4 pr-1 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } z-40`}
      >
        {/* زر إغلاق الـ Sidebar */}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 p-2 text-white rounded-lg"
        >
          <TbLayoutSidebarLeftCollapse className="w-7 h-7 text-neutral-400" />
        </button>

        {/* محتوى الـ Sidebar */}
        <button
          onClick={handleNewChat}
          className="w-1/2 bg-buttonColor p-2 rounded-xl mb-4 hover:bg-indigo-800 flex items-center font-sans"
        >
          <TbEdit className="w-6 h-6 mr-2 text-neutral-200" /> New chat
        </button>
        <h2 className="text-xl font-bold mb-4">Chats</h2>
        <div className="h-[calc(100vh-12rem)] overflow-y-auto custom-scrollbar">
          {Object.entries(groupedChats).map(([period, chats]) => (
            <div key={period} className="mb-4">
              <h3 className="text-xs font-semibold mb-2 text-currentColor">
                {period}
              </h3>
              <ul>
                {chats.map((chat) => (
                  <li
                    key={chat.id}
                    className="my-1 mr-1 text-neutral-300 font-sans"
                  >
                    <button
                      onClick={() => handleChatClick(chat.id)}
                      className={`w-full p-2 rounded-lg text-left text-sm ${
                        chat.id === chatId
                          ? "bg-neutral-800 text-white" // تنسيق الشات النشطة
                          : "bg-transparent hover:bg-neutral-800" // تنسيق الشات غير النشطة
                      }`}
                    >
                      {chat.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="h-16 w-full rounded-lg hover:bg-primaryColor"></div>
      </div>
    </>
  );
}
