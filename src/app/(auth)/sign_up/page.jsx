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
      router.push("/sign_in");
      if (!response.ok) throw new Error(await response.text());
      console.log("User registered successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-primaryColor">
      <div className="bg-transparent dark:bg-transparent p-3 px-5 rounded-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="xl:gap-16">
          <form onSubmit={handleSubmit}>
            {/* <button
            onClick={() => signIn("google")}
            className="w-full bg-green-700 hover:bg-green-600 text-white p-3 px-5 rounded-xl flex items-center justify-center mb-4"
          >
            <FcGoogle className="mr-2" /> Sign Up with Google
          </button> */}
            {/* <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="border focus:border-2 border-currentColor focus:border-buttonColor focus:outline-none my-2 text-zinc-900 w-full p-3 px-5 mb-4 rounded-xl"
            required
          /> */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="border focus:border-2 border-currentColor focus:border-buttonColor focus:outline-none my-2 bg-transparent text-neutral-100 w-full p-3 px-5 mb-4 rounded-xl"
                required
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="border focus:border-2 border-currentColor focus:border-buttonColor focus:outline-none my-2 bg-transparent text-neutral-100 w-full p-3 px-5 mb-4 rounded-xl"
                required
              />
            </div>
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="border focus:border-2 border-currentColor focus:border-buttonColor focus:outline-none my-2 bg-transparent text-neutral-100 w-full p-3 px-5 mb-4 rounded-xl"
                required
              />
            </div>
            <div>
              <div class="inline-flex items-center my-2">
                <label class="flex items-center cursor-pointer relative" for="check-with-link">
                  <input type="checkbox"
                    checked
                    class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-buttonColor checked:border-slate-800"
                    id="check-with-link" />
                  <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                      stroke="currentColor" stroke-width="1">
                      <path fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"></path>
                    </svg>
                  </span>
                </label>
                <label class="cursor-pointer ml-2 text-slate-100 text-sm" for="check-with-link">
                  <p>
                    I confirm that I have read, consent and agree to Dinosaur's &nbsp;
                    <a
                      href="#"
                      class="font-medium text-linkColor"
                    >
                      Terms of Use <span className="text-slate-100">and</span> Privacy Policy
                    </a>
                    .
                  </p>
                </label>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-buttonColor text-neutral-100 mt-10 p-3 px-5 rounded-xl"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign up"}
              </button>
            </div>
          </form>
        </div>
        <div className="flex justify-between text-linkColor mt-4 items-center w-full">
          <Link
            href="/forgot_password"
            className="h-10 text-left"
          >
            Forgot password?
          </Link>
          <Link
            href="sign_in"
            className="h-10 text-right"
          >
            Log in
          </Link>
        </div>

      </div>
    </div>
  );
}
