import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import Session from "@/models/Session";

export async function POST() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId");

  if (sessionId) {
    await connectDB();

    await Session.deleteOne({ sessionId: sessionId.value });
  }

  const response = NextResponse.json({ message: "Logged out" });

  response.cookies.set("sessionId", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  return response;
}