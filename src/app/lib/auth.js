import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // استخدام JSON Web Token لحفظ الجلسة
  },
  callbacks: {
    async signIn({ user, account }) {
      // console.log("User:", JSON.stringify(user, null, 2));
      // console.log("Account:", JSON.stringify(account, null, 2));

      if (account.provider) {
        try {
          // التحقق مما إذا كان الحساب موجودًا في جدول Account
          const existingAccount = await prisma.account.findUnique({
            where: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
            include: { user: true },
          });
          console.log("existingAccount: "+existingAccount);

          if (!existingAccount) {
            // البحث عن المستخدم في جدول User عبر البريد الإلكتروني
            let existingUser = await prisma.user.findUnique({
              where: { email: user.email },
            });

            if (!existingUser) {
              // إنشاء مستخدم جديد إذا لم يكن موجودًا
              existingUser = await prisma.user.create({
                data: {
                  name: user.name || "Unknown",
                  email: user.email,
                  image: user.image || null,
                  password: "", // لا حاجة لكلمة مرور عند استخدام OAuth
                  accounts: {
                    create: {
                      provider: account.provider,
                      providerAccountId: account.providerAccountId,
                      type: account.type,
                      access_token: account.access_token,
                      // refresh_token: account.refresh_token,
                      expires_at: account.expires_at,
                      token_type: account.token_type,
                      scope: account.scope,
                      id_token: account.id_token,
                    },
                  },
                },
              });
            } else {
              // في حالة كان المستخدم موجودًا ولكن لم يقم بتسجيل الدخول باستخدام هذا المزود من قبل
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  type: account.type,
                  access_token: account.access_token,
                  // refresh_token: account.refresh_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                },
              });
            }
          }
        } catch (error) {
          console.error("Error during sign-in:", error);
          throw new Error("OAuth sign-in failed");
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.image;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  debug: true,
};

export const getSession = () => getServerSession(authOptions)
