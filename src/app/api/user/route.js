import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const session = await getServerSession({ req, ...authOptions });

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      {
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
