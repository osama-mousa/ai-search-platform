"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useSession, signOut } from "next-auth/react";

export default function Header() {
    const { data: session, status } = useSession();
    // const [user, setUser] = useState(null); // حالة المستخدم (null إذا لم يكن مسجل الدخول)
    // const [loading, setLoading] = useState(true); // لتحميل البيانات

    // useEffect(() => {
    //     // استرداد بيانات المستخدم من API
    //     const fetchUser = async () => {
    //         try {
    //             const response = await axios.get('/api/user'); // استدعاء API لجلب بيانات المستخدم
    //             setUser(response.data); // تحديث حالة المستخدم
    //         } catch (error) {
    //             console.error('Error fetching user:', error);
    //         } finally {
    //             setLoading(false); // إنهاء التحميل
    //         }
    //     };

    //     fetchUser();
    // }, []);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return (
        <header className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-string">Dinosaur</h1>
            <div className="mt-0 flex text-sm text-center justify-center">
                {session?.user ? (
                    <div className="flex items-center gap-4">
                        <img src={session.user.image} alt="Profile" className="w-10 h-10 rounded-full" />
                        <button onClick={() => signOut()} className="bg-red-500 px-4 py-2 rounded">
                            Logout
                        </button>
                    </div>
                ) : (
                    // عرض أزرار تسجيل الدخول والتسجيل إذا لم يكن مسجل الدخول
                    <>
                        <Link
                            href="/sign_in"
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
