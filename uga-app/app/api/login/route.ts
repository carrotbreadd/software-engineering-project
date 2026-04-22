import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Session from "@/models/Session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { Email, Password } = body;

    const CleanEmail = Email?.trim().toLowerCase();
    const CleanPassword = Password?.trim();

    if (!CleanEmail || !CleanPassword) {
      return NextResponse.json(
        { Message: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const FoundUser = await User.findOne({ email: CleanEmail });

    if (!FoundUser) {
      return NextResponse.json(
        { Message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const PasswordMatches = await bcrypt.compare(
      CleanPassword,
      FoundUser.passwordHash
    );

    if (!PasswordMatches) {
      return NextResponse.json(
        { Message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const SessionId = crypto.randomBytes(32).toString("hex");
    const ExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    await Session.create({
      userId: FoundUser._id,
      sessionId: SessionId,
      expiresAt: ExpiresAt,
    });

    const Response = NextResponse.json(
      {
        Message: "Login successful",
        User: {
          Id: FoundUser._id,
          Username: FoundUser.username,
          Email: FoundUser.email,
        },
      },
      { status: 200 }
    );

    Response.cookies.set("sessionId", SessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: ExpiresAt,
    });

    return Response;
  } catch (error) {
    console.error("Login route error:", error);

    return NextResponse.json(
      {
        Message: "Server error",
        Error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}