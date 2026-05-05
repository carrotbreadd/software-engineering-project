import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import Session from "@/models/Session";
import User from "@/models/User";
import Post from "@/models/Post";

export async function POST(request: Request) {
  try {
    const { newPfp } = await request.json();

    if (!newPfp) {
      return NextResponse.json(
        { message: "No PFP sent" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("sessionId");

    if (!sessionCookie) {
      return NextResponse.json(
        { message: "No session" },
        { status: 401 }
      );
    }

    await connectDB();

    const session = await Session.findOne({
      sessionId: sessionCookie.value,
    });

    if (!session) {
      return NextResponse.json(
        { message: "Invalid session" },
        { status: 401 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      session.userId,
      {
        $set: {
          profileImage: newPfp,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 401 }
      );
    }

    await Post.updateMany(
      {
        username: updatedUser.username,
      },
      {
        $set: {
          profileImage: newPfp,
        },
      }
    );

    return NextResponse.json({
      message: "Updated",
      profileImage: updatedUser.profileImage,
    });
  } catch (error) {
    console.error("Update PFP error:", error);

    return NextResponse.json(
      {
        message: "Server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}