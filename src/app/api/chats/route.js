import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getAIResponse } from "@/app/lib/ai";

// 🔹 جلب المحادثات الخاصة بالمستخدم
export async function GET(req) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Unauthorized: No Token Provided" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // 🔹 لمعرفة القيم بعد فك التشفير

    const chats = await prisma.chat.findMany({
      where: { userId: decoded.userId },
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
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Unauthorized: No Token Provided" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
          userId: decoded.userId,
          messages: {
            create: [{ content: message, role: "user" }], // ⬅️ إنشاء رسالة المستخدم
          },
        },
        include: { messages: true }, // ✅ استرجاع الرسائل مع المحادثة
      });
    } else {
      // ⬅️ إضافة رسالة جديدة لمحادثة موجودة
      const chatExists = await prisma.chat.findUnique({
        where: { id: chatId, userId: decoded.userId },
      });

      if (!chatExists) {
        return NextResponse.json({ error: "Chat not found" }, { status: 404 });
      }

      // حفظ رسالة المستخدم
      await prisma.message.create({
        data: { chatId, content: message, role: "user" },
      });

      // الحصول على رد الذكاء الاصطناعي
      const aiResponse = await getAIResponse(message);

      // حفظ رد الذكاء الاصطناعي
      await prisma.message.create({
        data: { chatId, content: aiResponse, role: "assistant" },
      });

      // استرجاع المحادثة مع الرسائل
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
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Unauthorized: No Token Provided" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = params;
    const chat = await prisma.chat.findUnique({
      where: { id, userId: decoded.userId },
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
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Unauthorized: No Token Provided" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = await req.json();

    const chat = await prisma.chat.findUnique({
      where: { id, userId: decoded.userId },
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
