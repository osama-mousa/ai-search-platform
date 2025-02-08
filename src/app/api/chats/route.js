import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import { NextResponse } from "next/server";

// 🔹 جلب المحادثات الخاصة بالمستخدم
export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const chats = await prisma.chat.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(chats || []);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// 🔹 إنشاء أو تحديث محادثة
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { chatId, message } = body;

    if (!message.trim()) {
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 }
      );
    }

    let chat;
    if (!chatId) {
      // ⬅️ إنشاء محادثة جديدة
      chat = await prisma.chat.create({
        data: {
          title: message.slice(0, 20) || "New Chat",
          userId: session.user.id,
          messages: { create: [{ content: message }] }, // ⬅️ إنشاء الرسالة داخل المحادثة
        },
        include: { messages: true }, // ✅ استرجاع الرسائل مع المحادثة
      });
    } else {
      // ⬅️ إضافة رسالة جديدة لمحادثة موجودة
      const chatExists = await prisma.chat.findUnique({
        where: { id: chatId, userId: session.user.id },
      });

      if (!chatExists) {
        return NextResponse.json({ error: "Chat not found" }, { status: 404 });
      }

      await prisma.message.create({
        data: { chatId, content: message },
      });

      chat = await prisma.chat.findUnique({
        where: { id: chatId },
        include: { messages: true }, // ✅ تحديث المحادثة بالرسائل الجديدة
      });
    }

    return NextResponse.json({ chatId: chat.id, chat });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// 🔹 جلب محادثة معينة بمحتواها
export async function GET_BY_ID(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = params;
    const chat = await prisma.chat.findUnique({
      where: { id, userId: session.user.id },
      include: { messages: true }, // ✅ تضمين الرسائل مع المحادثة
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json(chat);
  } catch (error) {
    console.error("GET_BY_ID Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// 🔹 حذف محادثة
export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await req.json();

    const chat = await prisma.chat.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    await prisma.chat.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
