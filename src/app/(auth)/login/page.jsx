'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from 'next/link';


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login", { email, password }, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(response);
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
