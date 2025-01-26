/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";
import Header from "@/components/Header";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token"); // افترض أن التوكن يتم تخزينه في Local Storage
    setIsLoggedIn(!!token);
  }, []);

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
      {/* Sidebar */}
      {isLoggedIn && (
        <aside className="w-64 bg-gray-800 text-white p-4 space-y-6">
          <div className="text-2xl font-bold">Related Topics</div>
          {/* هنا يمكن عرض المواضيع المرتبطة بالمستخدم */}
          <ul>
            <li>Topic 1</li>
            <li>Topic 2</li>
            <li>Topic 3</li>
          </ul>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-100 dark:bg-background text-Sidebar dark:text-gray-100 p-2">
        <Header />

        <main className="flex-1 mt-28">
          {/* Display Results Above the Search Input */}
          {results ? (
            <div className="w-full max-w-2xl mx-auto mt-52 text-center font-bold text-3xl m-5">
              <h1>What are you looking for?</h1>
            </div>
          ) : (
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
          )}
          <div className="w-full max-w-3xl mx-auto bg-white dark:bg-inbut p-4 rounded-3xl shadow-md relative">
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
              {/* <svg class="animate-spin motion-reduce:hidden " width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none"><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m12 5 6 6m-6-6-6 6m6-6v14"/></svg> */}
              <img src="/arrow.svg" alt="Search" className="w-6 h-6" />
            </button>

            <div className="flex space-x-4 mt-4 items-center">
              <div
                onClick={() => setFilter("all")}
                className={`cursor-pointer ${
                  filter === "all"
                    ? "flex justify-center items-center bg-background rounded-lg h-8 w-8"
                    : "flex justify-center items-center hover:bg-zinc-800 rounded-lg h-8 w-8"
                }`}
              >
                <img src="/all.svg" alt="All" className="w-6 h-6" />
              </div>
              <div
                onClick={() => setFilter("articles")}
                className={`cursor-pointer ${
                  filter === "articles"
                    ? "flex justify-center items-center bg-background rounded-lg h-8 w-8"
                    : "flex justify-center items-center hover:bg-zinc-800 rounded-lg h-8 w-8"
                }`}
              >
                <img src="/file.svg" alt="Articles" className="w-6 h-6" />
              </div>
              <div
                onClick={() => setFilter("images")}
                className={`cursor-pointer ${
                  filter === "images"
                    ? "flex justify-center items-center bg-background rounded-lg h-8 w-8"
                    : "flex justify-center items-center hover:bg-zinc-800 rounded-lg h-8 w-8"
                }`}
              >
                <img src="/gallery.svg" alt="Images" className="w-6 h-6" />
              </div>
              <div
                onClick={() => setFilter("videos")}
                className={`cursor-pointer ${
                  filter === "videos"
                    ? "flex justify-center items-center bg-background rounded-lg h-8 w-8"
                    : "flex justify-center items-center hover:bg-zinc-800 rounded-lg h-8 w-8"
                }`}
              >
                <img src="/videos.svg" alt="Videos" className="w-7 h-7" />
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
