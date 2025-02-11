import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/app/providers/SessionProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import Sidebar from "@/app/_components/Sidebar";
import Footer from "@/app/_components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Chat App",
  description: "AI-powered chat platform",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={session}>
          {session ? (
            <div className="flex w-full">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                {children}
                <Footer />
              </div>
            </div>
          ) : (
            <>{children}</>
          )}
        </SessionProvider>
      </body>
    </html>
  );
}
