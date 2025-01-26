import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function Header() {
    const [user, setUser] = useState(null); // حالة المستخدم (null إذا لم يكن مسجل الدخول)
    const [loading, setLoading] = useState(true); // لتحميل البيانات

    useEffect(() => {
        // استرداد بيانات المستخدم من API
        const fetchUser = async () => {
            try {
                const response = await axios.get('/api/user'); // استدعاء API لجلب بيانات المستخدم
                setUser(response.data); // تحديث حالة المستخدم
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false); // إنهاء التحميل
            }
        };

        fetchUser();
    }, []);

    return (
        <header className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-string">AI Search Platform</h1>
            <div className="mt-0 flex text-sm text-center justify-center">
                {loading ? (
                    <span className="text-white">Loading...</span> // عرض حالة التحميل
                ) : user ? (
                    // عرض صورة الملف الشخصي إذا كان المستخدم مسجل الدخول
                    <div className="flex items-center">
                        {user?.image ? (
                            <img src={user.image} alt="Profile" className="h-10 w-10 rounded-full" />
                        ) : (
                            <DefaultProfileIcon className="h-10 w-10 rounded-full" />
                        )}

                        <span className="ml-2 text-white">{user.name}</span> {/* عرض اسم المستخدم */}
                    </div>
                ) : (
                    // عرض أزرار تسجيل الدخول والتسجيل إذا لم يكن مسجل الدخول
                    <>
                        <Link
                            href="/login"
                            className="bg-white text-black p-2 mx-1 h-10 w-20 rounded-full hover:bg-slate-100"
                        >
                            Log in
                        </Link>
                        <Link
                            href="/signup"
                            className="bg-background border border-inbut text-white p-2 mx-1 h-10 w-20 rounded-full hover:bg-zinc-800"
                        >
                            Sign up
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}
