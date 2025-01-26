import prisma from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json();
  const { email, password } = body;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, image: true },
  });
  
  if (!user) {
    return NextResponse.json({ message: "User not found." }, { status: 400 });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json({ message: "Invalid password." }, { status: 401 });
  }

  // حذف كلمة المرور قبل إرسال الاستجابة
  const { password: _, ...userWithoutPassword } = user;

  // نجاح العملية
  return NextResponse.json({ message: "Login successful", user: userWithoutPassword }, { status: 200 });
}
