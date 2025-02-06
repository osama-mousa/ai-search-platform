'use client';
import React, { useState, useEffect } from "react";
import { redirect, useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import axios from "axios";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineExclamationCircle } from "react-icons/ai";
import { FaExclamationCircle, FaTimes } from "react-icons/fa"; // استيراد الأيقونات
import { CiLock } from "react-icons/ci";

export default function SignUpPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // حالة لتخزين رسالة النجاح


  if (session) redirect("/")

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

    if (name === "password") {
      if (value && value.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else {
        delete newErrors.password;
      }
    }

    if (name === "confirmPassword") {
      if (value && value !== formData.password) {
        newErrors.confirmPassword = "Passwords do not match";
      } else {
        delete newErrors.confirmPassword;
      }
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validate(name, value);
  };

  const handleCheckboxChange = (e) => {
    setAgreeToTerms(e.target.checked);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) return;

    setLoading(true);

    try {
      const response = await axios.post("/api/sign_up", {
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 201) {
        setSuccessMessage(response?.data?.message || "Registration successful!"); // تعيين رسالة النجاح
        setTimeout(() => {
          setSuccessMessage("");
          router.push("/sign_in");
        }, 3000); // إخفاء الرسالة بعد 3 ثوانٍ وإعادة التوجيه

      } else {
        setErrors(response?.data?.message || "Something went wrong");
        setTimeout(() => setErrors(""), 5000);
      }

    } catch (err) {
      setServerError(err.message);
      setTimeout(() => setServerError(""), 5000);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-primaryColor font-sans">
      {/* Toast Notification لرسالة الخطأ */}
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

      {/* Toast Notification لرسالة النجاح */}
      {successMessage && (
        <div className="fixed top-10 left-0 right-0 flex justify-center">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-down flex items-center space-x-4">
            <AiOutlineExclamationCircle className="text-xl text-white m-1" /> {/* أيقونة النجاح */}
            <span>{successMessage}</span> {/* نص الرسالة */}
            <button
              onClick={() => setSuccessMessage("")}
              className="hover:bg-green-700 rounded-full p-1 transition-colors"
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
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className={`border focus:outline-none placeholder-currentColor bg-transparent text-neutral-100 w-full p-3 px-5 rounded-xl ${errors.email ? 'border-red-500' : 'border-currentColor focus:border-buttonColor'
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
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
          </div>
          <div className="relative">
            <CiLock size={20} className="absolute left-3 top-4 text-currentColor dark:text-currentColor" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`border focus:outline-none placeholder-currentColor bg-transparent pl-10 text-neutral-100 w-full p-3 px-5 rounded-xl ${errors.confirmPassword ? 'border-red-500' : 'border-currentColor focus:border-buttonColor'
                }`}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-4 text-gray-500 dark:text-gray-400"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <AiOutlineEyeInvisible size={20} className="text-neutral-100" /> : <AiOutlineEye size={20} className="text-neutral-100" />}
            </button>
            <div className="h-4 my-1">
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>
          </div>
          <div>
            <div className="inline-flex items-center my-2">
              <label className="flex items-center cursor-pointer relative" htmlFor="check-with-link">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={handleCheckboxChange}
                  className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border focus:outline-none border-slate-300 checked:bg-buttonColor checked:border-slate-800"
                  id="check-with-link"
                />
                <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </span>
              </label>
              <label className="cursor-pointer ml-2 text-neutral-200 text-sm" htmlFor="check-with-link">
                <p>
                  I confirm that I have read, consent and agree to Dinosaur's &nbsp;
                  <a href="#" className="font-medium text-linkColor">
                    Terms of Use <span className="text-neutral-200">and</span> Privacy Policy
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
              disabled={Object.values(errors).some(error => error !== "") || !agreeToTerms}
            >
              Sign up
            </button>
          </div>
        </form>
        <div className="flex justify-between text-linkColor mt-4 items-center w-full">
          <Link href="/forgot_password" className="h-10 text-left">Forgot password?</Link>
          <Link href="/sign_in" className="h-10 text-right">Log in</Link>
        </div>
      </div>
    </div>
  );
}