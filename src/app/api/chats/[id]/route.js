import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// ✅ جلب المحادثة مع الرسائل
export async function GET(req, { params }) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = params;

    const chat = await prisma.chat.findUnique({
      where: { id, userId: decoded.userId },
      include: { messages: true }, // ✅ تضمين الرسائل
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json(chat);
  } catch (error) {
    console.error("Error fetching chat:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ إضافة رسالة جديدة
export async function POST(req, { params }) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const { id: chatId } = params;
  const { content } = await req.json();

  if (!content || content.trim() === "") {
    return NextResponse.json(
      { error: "Message content is required" },
      { status: 400 }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // تأكد من أن المحادثة موجودة
    const chat = await prisma.chat.findUnique({
      where: { id: chatId, userId: decoded.userId },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // إضافة الرسالة
    const newMessage = await prisma.message.create({
      data: {
        content,
        chatId,
      },
    });

    return NextResponse.json({ newMessage }, { status: 201 });
  } catch (error) {
    console.error("Error adding message:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ تعديل رسالة
export async function PUT(req, { params }) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const { id: chatId } = params;
  const { messageId, content } = await req.json();

  if (!messageId || !content || content.trim() === "") {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // تحقق من أن الرسالة تنتمي إلى المحادثة
    const message = await prisma.message.findUnique({
      where: { id: messageId, chatId },
    });

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // تحديث الرسالة
    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: { content },
    });

    return NextResponse.json({ updatedMessage });
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ حذف رسالة
export async function DELETE(req, { params }) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const { id: chatId } = params;
  const { messageId } = await req.json();

  if (!messageId) {
    return NextResponse.json(
      { error: "Message ID is required" },
      { status: 400 }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // تحقق من أن الرسالة موجودة
    const message = await prisma.message.findUnique({
      where: { id: messageId, chatId },
    });

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // حذف الرسالة
    await prisma.message.delete({ where: { id: messageId } });

    return NextResponse.json({ success: true, messageId });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
