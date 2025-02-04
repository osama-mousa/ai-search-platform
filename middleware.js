import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request });

  const isAuth = !!token; // التحقق مما إذا كان المستخدم مسجل دخول أم لا

  const isProtectedRoute = pathname === "/";
  const isAuthRoute = pathname === "/sign_in" || pathname === "/sign_up";

  // إذا لم يكن المستخدم مسجلاً ويريد الوصول إلى الصفحة الرئيسية، نعيد توجيهه إلى صفحة تسجيل الدخول
  if (!isAuth && isProtectedRoute) {
    return NextResponse.redirect(new URL("/sign_in", request.url));
  }

  // إذا كان المستخدم مسجلاً ويريد الدخول إلى صفحة تسجيل الدخول أو التسجيل، نعيد توجيهه إلى الصفحة الرئيسية
  if (isAuth && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// تطبيق الـ Middleware على جميع المسارات
export const config = {
  matcher: ["/", "/sign_in", "/sign_up"],
};
