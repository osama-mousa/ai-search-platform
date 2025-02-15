import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // احتفظ بمفتاح API في ملف .env
});

export async function getAIResponse(userMessage) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // نموذج الذكاء الاصطناعي
      messages: [
        { role: "system", content: "You are a helpful assistant." }, // تعليمات للنموذج
        { role: "user", content: userMessage }, // رسالة المستخدم
      ],
    });

    return response.choices[0].message.content; // رد الذكاء الاصطناعي
  } catch (error) {
    console.error("Error getting AI response:", error);
    return "Sorry, I couldn't process your message."; // رسالة خطأ
  }
}
