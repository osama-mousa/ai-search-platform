import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";

export async function POST(req) {
  console.log("Signout request received");

  const session = await getServerSession(authOptions);
  console.log("Session data:", session);

  if (!session) {
    console.error("User not authenticated");
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
    });
  }

  try {
    console.log("User ID from session:", session.user.id);

    // التحقق من وجود الجلسات
    const sessions = await prisma.session.findMany({
      where: { userId: String(session.user.id) },
    });
    console.log("Sessions found:", sessions);

    // حذف جميع جلسات المستخدم
    await prisma.session.deleteMany({
      where: { userId: String(session.user.id) },
    });

    console.log("Sessions deleted successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error during signout:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}