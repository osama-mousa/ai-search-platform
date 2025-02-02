'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) return;

    setLoading(true);

    try {
      const response = await fetch("/api/sign_up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      router.push("/sign_in");
      if (!response.ok) throw new Error(await response.text());
      console.log("User registered successfully");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-primaryColor">
      <div className="bg-transparent dark:bg-transparent p-3 px-5 rounded-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className={`border bg-transparent text-neutral-100 w-full p-3 px-5 rounded-xl ${errors.email ? 'border-red-500' : 'border-currentColor focus:border-buttonColor'
                }`}
              required
            />
            <div className="h-4 my-1">
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`border bg-transparent text-neutral-100 w-full p-3 px-5 rounded-xl ${errors.password ? 'border-red-500' : 'border-currentColor focus:border-buttonColor'
                }`}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-5 text-gray-500 dark:text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
            <div className="h-4 my-1">
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
          </div>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`border bg-transparent text-neutral-100 w-full p-3 px-5 rounded-xl ${errors.confirmPassword ? 'border-red-500' : 'border-currentColor focus:border-buttonColor'
                }`}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-5 text-gray-500 dark:text-gray-400"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
            <div className="h-4 my-1">
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>
          </div>
          <div>
            <div className="inline-flex items-center my-2">
              <label className="flex items-center cursor-pointer relative" for="check-with-link">
                <input type="checkbox"
                  checked
                  className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-buttonColor checked:border-slate-800"
                  id="check-with-link" />
                <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                    stroke="currentColor" stroke-width="1">
                    <path fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"></path>
                  </svg>
                </span>
              </label>
              <label className="cursor-pointer ml-2 text-slate-100 text-sm" for="check-with-link">
                <p>
                  I confirm that I have read, consent and agree to Dinosaur's &nbsp;
                  <a
                    href="#"
                    className="font-medium text-linkColor"
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
              disabled={Object.values(errors).some(error => error !== "")}
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