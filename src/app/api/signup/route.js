import prisma from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';
import { promises as fs } from 'fs';
import path from 'path';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid'; // لتوليد UUID لضمان فريدة الاسم

export const config = {
  api: {
    bodyParser: false, // إيقاف المعالج الافتراضي
  },
};

// إعداد تخزين Multer
const storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

export async function POST(req) {
  if (req.method === 'POST') {
    upload.single('image')(req, {}, async (err) => {
      if (err) {
        console.error('Error uploading file:', err);
        return NextResponse.json({ message: "Error uploading image" }, { status: 500 });
      }

      const { name, email, password } = req.body;

      // تحقق إذا كان البريد الإلكتروني موجودًا
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) return NextResponse.json({ message: "Email already registered." }, { status: 400 });

      // تشفير كلمة المرور
      const hashedPassword = await bcrypt.hash(password, 10);

      let imageUrl = null;
      if (req.file) {
        const filePath = path.join('public/uploads', req.file.filename);
        await fs.rename(req.file.path, filePath);
        imageUrl = `/uploads/${req.file.filename}`;
      }

      // حفظ المستخدم في قاعدة البيانات
      const newUser = await prisma.user.create({
        data: { name, email, password: hashedPassword, image: imageUrl },
      });

      return NextResponse.json(newUser, { status: 201 });
    });
  } else {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }
}
