import { getSession } from "next-auth/react"; // أو استخدم مكتبة جلسات أخرى إذا كنت تستخدمها

export async function GET(req) {
  const session = await getSession({ req });

  if (!session) {
    return new Response(JSON.stringify({}), { status: 401 }); // المستخدم غير مسجل
  }

  // جلب بيانات المستخدم من قاعدة البيانات
  const user = {
    name: session.user.name,
    email: session.user.email,
    profilePicture: session.user.image, // تعديل حسب قاعدة بياناتك
  };

  return new Response(JSON.stringify(user), { status: 200 });
}
