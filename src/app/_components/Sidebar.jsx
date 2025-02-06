'use client';
import React, { useState, useEffect } from 'react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // حالة فتح وإغلاق الـ Sidebar
  const [topics, setTopics] = useState([]); // حالة لتخزين المواضيع المرتبطة بالمستخدم
  const [loading, setLoading] = useState(true); // حالة التحميل

  // دالة لجلب المواضيع من API
  const fetchTopics = async () => {
    try {
      const response = await fetch('/api/topics'); // استبدل بمسار API الخاص بك
      if (!response.ok) {
        throw new Error('Failed to fetch topics');
      }
      const data = await response.json();
      setTopics(data); // تعيين المواضيع في الحالة
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false); // إيقاف التحميل
    }
  };

  // جلب المواضيع عند تحميل المكون
  useEffect(() => {
    fetchTopics();
  }, []);

  return (
    <div className=''>
      {/* زر فتح/إغلاق الـ Sidebar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg shadow-lg"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* الـ Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-sidbarColor bg-opacity-75 backdrop-blur-3xl transition-transform duration-300 text-white p-4 space-y-6 transform ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="text-2xl font-bold">Related Topics</div>
        {loading ? (
          <p>Loading topics...</p> // عرض رسالة التحميل
        ) : (
          <ul>
            {topics.length > 0 ? (
              topics.map((topic, index) => (
                <li key={index} className="p-2 hover:bg-gray-700 rounded-lg">
                  {topic.name} {/* عرض اسم الموضوع */}
                </li>
              ))
            ) : (
              <p>No topics found.</p> // عرض رسالة إذا لم توجد مواضيع
            )}
          </ul>
        )}
      </aside>
    </div>
  );
};

export default Sidebar;