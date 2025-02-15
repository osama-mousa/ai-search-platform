import { getAIResponse } from "@/lib/ai"; // استيراد وظيفة الذكاء الاصطناعي
import { NextResponse } from "next/server";

export async function POST(request) {
  const { message } = await request.json(); // استخراج الرسالة من الطلب

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  try {
    const aiResponse = await getAIResponse(message); // الحصول على رد الذكاء الاصطناعي
    return NextResponse.json({ response: aiResponse }); // إرجاع الرد
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get AI response" },
      { status: 500 }
    );
  }
}
