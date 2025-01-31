// signup.jsx (SignUp Page)
'use client';
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";
import Link from 'next/link';
import axios from "axios";
import { FcGoogle } from 'react-icons/fc';
import { useEffect } from "react";
import { useSession } from "next-auth/react";


export default function SignUpPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.push("/"); // إعادة توجيه المستخدم إذا كان مسجلاً الدخول
    }
  }, [session, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      router.push("/login");
      if (!response.ok) throw new Error(await response.text());
      console.log("User registered successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-background">
      <div className="bg-white dark:bg-input p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <button
            onClick={() => signIn("google")}
            className="w-full bg-green-700 hover:bg-green-600 text-white p-2 rounded flex items-center justify-center mb-4"
          >
            <FcGoogle className="mr-2" /> Sign Up with Google
          </button>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="border text-zinc-900 w-full p-2 mb-4 rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border text-zinc-900 w-full p-2 mb-4 rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="border text-zinc-900 w-full p-2 mb-4 rounded"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="border text-zinc-900 w-full p-2 mb-4 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white p-2 rounded mb-4"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <Link
          href="/login"
          className="flex items-center justify-center text-center text-zinc-200 hover:text-white mt-5 h-10 w-full"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
