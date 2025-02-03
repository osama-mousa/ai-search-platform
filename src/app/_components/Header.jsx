"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useSession, signOut } from "next-auth/react";
import Image from 'next/image';
import ProfileMenu from './Menu';


export default function Header() {
    const { data: session, status } = useSession();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return (
        <header className="flex justify-between items-center mb-6 font-sans">
            <h1 className="text-xl font-bold text-string">Dinosaur</h1>
            <div className="mt-0 flex text-sm text-center justify-center">
                {session?.user ? (
                    <div className="flex mr-8 mt-2 items-center gap-4 relative" ref={dropdownRef}>
                        {/* Profile Image Button */}
                        <button
                            onClick={toggleDropdown}
                            className="focus:outline-none"
                            aria-haspopup="true"
                            aria-expanded={isDropdownOpen}
                        >
                            <Image
                                width={40} // Set to the actual width of the image
                                height={40} // Set to the actual height of the image
                                src={session?.user?.image} // Source of the image
                                alt="User Image" // Alt text for accessibility
                                quality={100} // Set quality to 100 for best quality
                                className="w-9 h-9 rounded-full cursor-pointer" // Tailwind CSS classes for styling
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <ProfileMenu />
                        )}
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
                            href="/sign_up"
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