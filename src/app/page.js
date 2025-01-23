"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState("light");
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.className = savedTheme;
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.className = newTheme;
    localStorage.setItem("theme", newTheme);
  };

  const handleSearch = async () => {
    if (query.trim() === "") return;
    setIsLoading(true);
    try {
      const response = await axios.post("/api/search", { query, filter });
      setResults(response.data.results);
      setSearchHistory((prev) => [...prev, query]);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <Head>
        <title>AI Search Platform</title>
        <meta
          name="description"
          content="AI-powered search platform with filtered results"
        />
      </Head>

      {/* Sidebar */}
      <aside className="w-64 bg-Sidebar text-white p-4 space-y-6">
        <div className="text-2xl font-bold">Search History</div>
        <ul className="space-y-2">
          {searchHistory.map((history, index) => (
            <li key={index} className="bg-gray-700 p-2 rounded">
              {history}
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <Link
            href="/login"
            className="block bg-blue-500 text-white text-center py-2 rounded hover:bg-blue-600"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="block bg-green-500 text-white text-center py-2 mt-2 rounded hover:bg-green-600"
          >
            Sign Up
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-100 dark:bg-background text-Sidebar dark:text-gray-100 p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">AI Search Platform</h1>
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center"
          >
            <img
              src={theme === "light" ? "/sun.png" : "/moon.png"}
              alt={theme === "light" ? "Light Mode" : "Dark Mode"}
              className="w-8 h-8"
            />
          </button>
        </header>

        <main className="flex-1">
          {/* Display Results Above the Search Input */}
          <div className="w-full max-w-2xl mx-auto mt-52">
            <div className="p-4 rounded shadow-md">
              <div className="results space-y-4">
                {results.map((result, index) => (
                  <div key={index} className="border-b pb-4">
                    {result.type === "article" && (
                      <div>
                        <h2 className="text-lg font-bold">{result.title}</h2>
                        <p>{result.content}</p>
                      </div>
                    )}
                    {result.type === "image" && (
                      <div>
                        <img
                          src={result.url}
                          alt={result.alt}
                          className="w-full h-auto rounded"
                        />
                        <p>{result.caption}</p>
                      </div>
                    )}
                    {result.type === "video" && (
                      <div>
                        <video
                          controls
                          src={result.url}
                          className="w-full h-auto rounded"
                        ></video>
                        <p>{result.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full max-w-2xl mx-auto bg-white dark:bg-inbut p-4 rounded-3xl shadow-md relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask me anything..."
              className="p-2 rounded w-full bg-gray-100 dark:bg-inbut focus:outline-none pr-12" // إضافة "pr-12" لترك مساحة للزر
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-white text-white flex items-center justify-center hover:bg-gray-400"
            >
              <img src="/arrow.svg" alt="Search" className="w-6 h-6" />
            </button>

            <div className="flex space-x-4 mt-4">
              <div
                onClick={() => setFilter("all")}
                className={`cursor-pointer ${
                  filter === "all" ? "border-2 border-blue-500" : ""
                }`}
              >
                <img src="/all.png" alt="All" className="w-5 h-5" />
              </div>
              <div
                onClick={() => setFilter("articles")}
                className={`cursor-pointer ${
                  filter === "articles" ? "border-2 border-blue-500" : ""
                }`}
              >
                <img src="/articles.png" alt="Articles" className="w-5 h-5" />
              </div>
              <div
                onClick={() => setFilter("images")}
                className={`cursor-pointer ${
                  filter === "images" ? "border-2 border-blue-500" : ""
                }`}
              >
                <img src="/gallery.svg" alt="Images" className="w-5 h-5" />
              </div>
              <div
                onClick={() => setFilter("videos")}
                className={`cursor-pointer ${
                  filter === "videos" ? "border-2 border-blue-500" : ""
                }`}
              >
                <img src="/videos.png" alt="Videos" className="w-5 h-5" />
              </div>
            </div>
          </div>
        </main>

        <footer className="mt-6 text-center text-sm">
          &copy; 2025 AI Search Platform
        </footer>
      </div>
    </div>
  );
}
