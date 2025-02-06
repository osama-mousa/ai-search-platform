"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import Image from 'next/image';
import ProfileMenu from './Menu';

export default function Header() {
    const { data: session, status } = useSession();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

    // إغلاق القائمة عند النقر خارجها
    const handleClickOutside = useCallback((event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [handleClickOutside]);

    if (status === "loading") return <div>Loading...</div>;

    // الصورة الافتراضية باستخدام UI Avatars
    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.email || "User")}&background=random&color=fff&size=40`;

    return (
        <header className="flex justify-between items-center mb-6 font-sans">
            <h1 className="text-xl font-bold text-string">Dinosaur</h1>
            <div className="mt-0 flex text-sm text-center justify-center">
                {session?.user ? (
                    <div className="flex mr-8 mt-2 items-center gap-4 relative" ref={dropdownRef}>
                        {/* زر الصورة الشخصية */}
                        <button onClick={toggleDropdown} className="focus:outline-none" aria-haspopup="true" aria-expanded={isDropdownOpen}>
                            <Image
                                width={40}
                                height={40}
                                src={session.user.image || defaultAvatar}
                                alt="User Avatar"
                                quality={100}
                                priority
                                className="w-9 h-9 rounded-full cursor-pointer"
                            />
                        </button>

                        {/* القائمة المنسدلة */}
                        {isDropdownOpen && <ProfileMenu />}
                    </div>
                ) : (
                    // أزرار تسجيل الدخول والتسجيل
                    <>
                        <Link href="/sign_in" className="bg-white text-black p-2 mx-1 h-10 w-20 rounded-full hover:bg-slate-100">
                            Log in
                        </Link>
                        <Link href="/sign_up" className="bg-background border border-inbut text-white p-2 mx-1 h-10 w-20 rounded-full hover:bg-zinc-800">
                            Sign up
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}
