'use client';
import React, { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import axios from "axios";
import Link from 'next/link';
import { useSession, signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineMail } from "react-icons/hi";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineExclamationCircle } from "react-icons/ai";
import { FaTimes } from "react-icons/fa";
import { CiLock } from "react-icons/ci";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  if (session) redirect("/");

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  const validate = (name, value) => {
    let newErrors = { ...errors };

    if (name === "email") {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors.email = "Invalid email format";
      } else {
        delete newErrors.email;
      }
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validate(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // تحقق من الأخطاء
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await axios.post("/api/sign_in", { email: formData.email, password: formData.password }, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.status === 200) {
        router.push('/');
      } else {
        setError(response?.data?.message || "Something went wrong");
        setTimeout(() => setError(""), 5000);

      }
    } catch (err) {
      setServerError(err.message);
      setTimeout(() => setServerError(""), 5000);
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Something went wrong");
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-primaryColor font-sans">
      {serverError && (
        <div className="fixed top-10 left-0 right-0 flex justify-center">
          <div className="bg-alertColor text-white px-6 py-3 rounded-lg shadow-lg animate-slide-down flex items-center space-x-4">
            <AiOutlineExclamationCircle className="text-xl text-red-500 m-1" /> {/* أيقونة الخطأ */}
            <span>{serverError}</span> {/* نص الرسالة */}
            <button
              onClick={() => setServerError("")}
              className="hover:bg-neutral-800 rounded-full p-1 transition-colors"
            >
              <FaTimes className="text-lg" /> {/* أيقونة الإغلاق */}
            </button>
          </div>
        </div>
      )}

      <div className="bg-transparent dark:bg-transparent p-3 px-5 rounded-xl w-full max-w-sm">
        <div className="flex justify-between w-full items-center">
          <img src="/dinosaur.svg" className="h-40 text-left" alt="" />
          <div className="justify-between">
            <h1 className="text-4xl font-bold text-indigo-600">Dinosaur</h1>
            {/* <h2 className="text-xl font-bold text-right">Sign Up</h2> */}
          </div>
        </div>
        {/* <h2 className="text-2xl font-bold mb-6">Log in</h2> */}

        <div className="xl:gap-16">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <HiOutlineMail size={20} className="absolute left-3 top-4 text-currentColor dark:text-currentColor" />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className={`border focus:outline-none placeholder-currentColor bg-transparent pl-10 text-neutral-100 w-full p-3 px-5 rounded-xl ${errors.email ? 'border-red-500' : 'border-currentColor focus:border-buttonColor'
                  }`}
                required
              />
              <div className="h-4 my-1">
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
            </div>
            <div className="relative">
              <CiLock size={20} className="absolute left-3 top-4 text-currentColor dark:text-currentColor" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`border focus:outline-none placeholder-currentColor bg-transparent pl-10 text-neutral-100 w-full p-3 px-5 rounded-xl ${errors.password ? 'border-red-500' : 'border-currentColor focus:border-buttonColor'
                  }`}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-4 text-gray-500 dark:text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} className="text-neutral-100" /> : <AiOutlineEye size={20} className="text-neutral-100" />}
              </button>
              <div className="h-4 my-1">
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-buttonColor text-neutral-100 mt-5 p-3 px-5 rounded-xl"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log in"}
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
        <div className="flex w-full justify-between items-center text-currentColor">
          <hr className="border-1 w-full border-currentColor text-left" />
          <p className="mx-3 text-sm">OR</p>
          <hr className="border-1 w-full border-currentColor text-right" />
        </div>
        {/* تسجيل الدخول عبر Google */}
        <div className="">
          <button
            onClick={() => signIn("google")}
            className="flex border border-currentColor w-full justify-center items-center bg-transparent hover:bg-neutral-700 text-neutral-100 mt-4 p-3 px-5 rounded-xl"
          >
            <img src="/google.svg" size={20} className="h-5 w-5 mx-2" />
            <p className="">Log in with Google</p>
          </button>
        </div>
      </div>
    </div>
  );
}
