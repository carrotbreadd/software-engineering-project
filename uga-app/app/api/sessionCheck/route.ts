"use server";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import Session from "@/models/Session";
import User from "@/models/User";

export async function GET() {
  const CookieStore = await cookies();
  const SessionCookie = CookieStore.get("sessionId");

  if (!SessionCookie) {
    return NextResponse.json(
      { Message: "No session found" },
      { status: 401 }
    );
  }

  try {

    await connectDB();

    const FoundSession = await Session.findOne({
      sessionId: SessionCookie.value,
    });

    if (!FoundSession) {
      const Response = NextResponse.json(
        { Message: "Session not found" },
        { status: 401 }
      );

      Response.cookies.set("sessionId", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(0),
      });

      return Response;
    }

    const SessionIsExpired = new Date(FoundSession.expiresAt) <= new Date();

    if (SessionIsExpired) {
      await Session.deleteOne({ _id: FoundSession._id });

      const Response = NextResponse.json(
        { Message: "Session expired" },
        { status: 401 }
      );

      Response.cookies.set("sessionId", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(0),
      });

      return Response;
    }

    const FoundUser = await User.findById(FoundSession.userId);

    if (!FoundUser) {
      await Session.deleteOne({ _id: FoundSession._id });

      const Response = NextResponse.json(
        { Message: "User for this session was not found" },
        { status: 401 }
      );

      Response.cookies.set("sessionId", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(0),
      });

      return Response;
    }

     return NextResponse.json(
  {
    Message: "Session found",
    User: {
      Id: FoundUser._id,
      Username: FoundUser.username,
      Email: FoundUser.email,
      points: FoundUser.points || 0,
      profileImage: FoundUser.profileImage ?? "/cpy1.png",
    },
  },
  { status: 200 }
);
  } catch (error) {
    console.error("Session check error:", error);

    return NextResponse.json(
      {
        Message: "Server error",
        Error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}