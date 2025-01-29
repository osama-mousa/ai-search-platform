import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/app/lib/prisma";

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async session({ session, user }) {
        session.user.id = user.id; // إضافة ID إلى بيانات الجلسة
        return session;
      },
    },
    pages: {
      signIn: "/login", // تحديد صفحة تسجيل الدخول
    },
    debug: true, // تفعيل وضع التصحيح لمعرفة الأخطاء في الـ console
  };
