import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/app/lib/prisma";
import { authOptions } from "@/app/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
