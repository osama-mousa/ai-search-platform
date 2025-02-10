import prisma from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // التحقق من البيانات المدخلة
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
    }

    // البحث عن المستخدم في قاعدة البيانات
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, image: true, password: true }, // استرجاع كلمة المرور
    });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 400 });
    }

    // التحقق من كلمة المرور
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ message: "Invalid password." }, { status: 401 });
    }

    // إزالة كلمة المرور من الاستجابة
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ message: "Login successfully!", user: userWithoutPassword }, { status: 200 });
  } catch (error) {
    console.error("Error in login API:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
