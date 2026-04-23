import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import Session from "@/models/Session";
import User from "@/models/User";

const DefaultProfileImage = "/cpy1.png";

type SavedPost = {
  _id: string;
  userId: string;
  username: string;
  profileImage?: string;
  content: string;
  createdAt: Date;
};

export async function GET() {
  try {
    await connectDB();

    const Posts = await Post.find({})
      .sort({ createdAt: -1 })
      .limit(25)
      .lean<SavedPost[]>();

    return NextResponse.json(
      {
        Message: "Posts loaded",
        Posts: Posts.map((PostItem) => ({
          Id: PostItem._id,
          UserId: PostItem.userId,
          Username: PostItem.username,
          ProfileImage: PostItem.profileImage || DefaultProfileImage,
          Text: PostItem.content,
          CreatedAt: PostItem.createdAt,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Load posts error:", error);

    return NextResponse.json(
      {
        Message: "Server error",
        Error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const Body = await request.json();
    const { Text } = Body;

    const CleanText = Text?.trim();

    if (!CleanText) {
      return NextResponse.json(
        { Message: "Post cannot be empty" },
        { status: 400 }
      );
    }

    const CookieStore = await cookies();
    const SessionCookie = CookieStore.get("sessionId");

    if (!SessionCookie) {
      return NextResponse.json(
        { Message: "You must be logged in to post" },
        { status: 401 }
      );
    }

    await connectDB();

    const FoundSession = await Session.findOne({
      sessionId: SessionCookie.value,
    });

    if (!FoundSession) {
      return NextResponse.json(
        { Message: "Session not found" },
        { status: 401 }
      );
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
      return NextResponse.json(
        { Message: "User not found" },
        { status: 401 }
      );
    }

    const NewPost = await Post.create({
      userId: FoundUser._id,
      username: FoundUser.username,
      profileImage: FoundUser.profileImage || DefaultProfileImage,
      content: CleanText,
    });

    return NextResponse.json(
      {
        Message: "Post created",
        Post: {
          Id: NewPost._id,
          UserId: NewPost.userId,
          Username: NewPost.username,
          ProfileImage: NewPost.profileImage || DefaultProfileImage,
          Text: NewPost.content,
          CreatedAt: NewPost.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Post route error:", error);

    return NextResponse.json(
      {
        Message: "Server error",
        Error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
