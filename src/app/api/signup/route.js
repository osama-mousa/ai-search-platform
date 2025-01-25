import prisma from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  if (req.method === "POST") {
    const body = await req.json();
    const { name, email, password } = body;

    // تحقق إذا كان البريد الإلكتروني مسجلًا
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: "Email already registered." }),
        { status: 400 }
      );
    }
    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // حفظ المستخدم في قاعدة البيانات
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return new Response(JSON.stringify({ message: "Sign up successful" }), {
      status: 201,
    });
  }
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
