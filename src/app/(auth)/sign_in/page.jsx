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

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/sign_in", { email, password }, {
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
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-primaryColor">
      <div className="bg-transparent dark:bg-transparent p-3 px-5 rounded-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6">Log in</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="xl:gap-16">
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border focus:border-2 border-currentColor focus:border-buttonColor focus:outline-none my-2 bg-transparent text-neutral-100 w-full p-3 px-5 mb-4 rounded-xl"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border focus:border-2 border-currentColor focus:border-buttonColor focus:outline-none my-2 bg-transparent text-neutral-100 w-full p-3 px-5 mb-4 rounded-xl"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-buttonColor text-neutral-100 mt-10 p-3 px-5 rounded-xl"
              >
                Login
              </button>
            </div>
          </form>
        </div>
        <div className="flex justify-between text-linkColor mt-4 items-center w-full">
          <Link href="/forgot_password" className="h-10 text-left">
            Forgot password?
          </Link>
          <Link href="/sign_up" className="h-10 text-right">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
