import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

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

    if (!CleanEmail.includes("@") || !CleanEmail.includes(".")) {
      return NextResponse.json(
        { Message: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    if (CleanPassword.length <= 5) {
      return NextResponse.json(
        { Message: "Password must be longer than 5 characters" },
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

    return NextResponse.json(
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
