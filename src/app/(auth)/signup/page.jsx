// signup.jsx (SignUp Page)
'use client';
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";
import Link from 'next/link';
import axios from "axios";
import { FcGoogle } from 'react-icons/fc';


export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(await response.text());
      console.log("User registered successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-background">
      <div className="bg-white dark:bg-input p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
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
        <button
          onClick={() => signIn("google")}
          className="w-full bg-zinc-900 hover:bg-zinc-800 text-white p-2 rounded flex items-center justify-center"
        >
          <FcGoogle className="mr-2" /> Sign Up with Google
        </button>
        <Link
          href="/login"
          className="flex items-center justify-center text-center text-zinc-200 hover:text-zinc-50 p-2 mx-1 h-10 w-full"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
