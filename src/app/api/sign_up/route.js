import prisma from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // التحقق من وجود محتوى في الطلب
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { message: "Invalid content type, expected JSON" },
        { status: 400 }
      );
    }

    // قراءة البيانات من الطلب
    const body = await req.json();

    const { name, email, password, confirmPassword, image } = body;

    // التحقق من الحقول المطلوبة
    if (!email || !password || !confirmPassword) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // التحقق من تطابق كلمة المرور
    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match" },
        { status: 400 }
      );
    }

    // التحقق من وجود المستخدم بالفعل
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // حفظ المستخدم الجديد في قاعدة البيانات
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        image: image || null, // حفظ الصورة إذا كانت موجودة
      },
    });

    // حذف كلمة المرور قبل إرسال الاستجابة
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({ message: "Sign Up successful", newUser: userWithoutPassword }, { status: 201 });
  } catch (error) {
    console.error("Error in signup API:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
