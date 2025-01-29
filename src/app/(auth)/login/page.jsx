'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from 'next/link';
import { useSession, signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();
  const { data: session } = useSession();

  // إعادة التوجيه بعد تسجيل الدخول
  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  // تسجيل الدخول بالطريقة التقليدية
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login", { email, password }, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.status === 200) {
        router.push('/');
      } else {
        setError(response.data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-background">
      <div className="bg-white dark:bg-input p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* تسجيل الدخول عبر Google */}
        <button
          onClick={() => signIn("google")}
          className="w-full bg-green-700 hover:bg-green-600 flex items-center justify-center text-white p-2 rounded mb-4"
        >
          <FcGoogle className="mr-2" />Sign in with Google
        </button>

        <hr className="my-4 border-gray-300" />

        {/* نموذج تسجيل الدخول التقليدي */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border w-full p-2 rounded text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border w-full p-2 rounded text-black"
              required
            />
          </div>
          <button type="submit" className="w-full bg-zinc-900 hover:bg-zinc-800 text-white p-2 rounded">
            Login
          </button>
        </form>

        {/* رابط لإنشاء حساب جديد */}
        <Link
          href="/signup"
          className="flex items-center justify-center text-center text-zinc-200 hover:text-white mt-5 h-10 w-full"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
