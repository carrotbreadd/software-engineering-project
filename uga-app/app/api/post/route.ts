import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Types } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import Session from "@/models/Session";
import User from "@/models/User";

const DefaultProfileImage = "/cpy1.png";

type PostComment = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  username: string;
  profileImage?: string;
  content: string;
  createdAt: Date;
};

function FormatPost(PostItem: {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  username: string;
  profileImage?: string;
  content: string;
  likes?: Types.ObjectId[];
  comments?: PostComment[];
  commentCount?: number;
  createdAt: Date;
}, CurrentUserId?: string) {
  const Likes = PostItem.likes || [];
  const Comments = PostItem.comments || [];

  return {
    Id: PostItem._id.toString(),
    UserId: PostItem.userId.toString(),
    Username: PostItem.username,
    ProfileImage: PostItem.profileImage || DefaultProfileImage,
    Text: PostItem.content,
    CreatedAt: PostItem.createdAt,
    LikeCount: Likes.length,
    CommentCount: PostItem.commentCount ?? Comments.length,
    IsLikedByCurrentUser: CurrentUserId
      ? Likes.some((LikeUserId) => LikeUserId.toString() === CurrentUserId)
      : false,
  };
}

function FormatComment(CommentItem: PostComment) {
  return {
    Id: CommentItem._id.toString(),
    UserId: CommentItem.userId.toString(),
    Username: CommentItem.username,
    ProfileImage: CommentItem.profileImage || DefaultProfileImage,
    Text: CommentItem.content,
    CreatedAt: CommentItem.createdAt,
  };
}

async function GetCurrentUser() {
  const CookieStore = await cookies();
  const SessionCookie = CookieStore.get("sessionId");

  if (!SessionCookie) {
    return { ErrorResponse: null, FoundUser: null };
  }

  const FoundSession = await Session.findOne({
    sessionId: SessionCookie.value,
  });

  if (!FoundSession) {
    return { ErrorResponse: null, FoundUser: null };
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

    return { ErrorResponse: Response, FoundUser: null };
  }

  const FoundUser = await User.findById(FoundSession.userId);

  if (!FoundUser) {
    return {
      ErrorResponse: NextResponse.json(
        { Message: "User not found" },
        { status: 401 }
      ),
      FoundUser: null,
    };
  }

  return { ErrorResponse: null, FoundUser };
}

export async function GET(request: Request) {
  try {
    await connectDB();

    const Url = new URL(request.url);
    const PostId = Url.searchParams.get("postId");
    const IncludeComments = Url.searchParams.get("includeComments");

    const { FoundUser } = await GetCurrentUser();
    const CurrentUserId = FoundUser?._id.toString();

    if (PostId && IncludeComments === "true") {
      const FoundPost = await Post.findById(PostId).lean();

      if (!FoundPost) {
        return NextResponse.json(
          { Message: "Post not found" },
          { status: 404 }
        );
      }

      const LoadedComments = (FoundPost.comments || [])
        .slice()
        .sort(
          (Left: PostComment, Right: PostComment) =>
            new Date(Right.createdAt).getTime() -
            new Date(Left.createdAt).getTime()
        )
        .map((CommentItem: PostComment) => FormatComment(CommentItem));

      return NextResponse.json(
        {
          Message: "Comments loaded",
          Post: FormatPost(FoundPost, CurrentUserId),
          Comments: LoadedComments,
        },
        { status: 200 }
      );
    }

    const Posts = await Post.find({}).sort({ createdAt: -1 }).limit(25).lean();

    return NextResponse.json(
      {
        Message: "Posts loaded",
        Posts: Posts.map((PostItem) => FormatPost(PostItem, CurrentUserId)),
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

    await connectDB();

    const { ErrorResponse, FoundUser } = await GetCurrentUser();

    if (ErrorResponse) {
      return ErrorResponse;
    }

    if (!FoundUser) {
      return NextResponse.json(
        { Message: "You must be logged in to post" },
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
        Post: FormatPost(NewPost, FoundUser._id.toString()),
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

export async function PATCH(request: Request) {
  try {
    const Body = await request.json();
    const { Action, PostId, Text } = Body;

    if (!PostId || !Types.ObjectId.isValid(PostId)) {
      return NextResponse.json(
        { Message: "Valid post ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const { ErrorResponse, FoundUser } = await GetCurrentUser();

    if (ErrorResponse) {
      return ErrorResponse;
    }

    if (!FoundUser) {
      return NextResponse.json(
        { Message: "You must be logged in to continue" },
        { status: 401 }
      );
    }

    const FoundPost = await Post.findById(PostId);

    if (!FoundPost) {
      return NextResponse.json(
        { Message: "Post not found" },
        { status: 404 }
      );
    }

    const CurrentUserId = FoundUser._id.toString();
    const IsPostOwner = FoundPost.userId.toString() === CurrentUserId;

    if (Action === "toggleLike") {
      const ExistingLike = FoundPost.likes.find(
        (LikeUserId: Types.ObjectId) =>
          LikeUserId.toString() === CurrentUserId
      );

      if (ExistingLike) {
        FoundPost.likes = FoundPost.likes.filter(
          (LikeUserId: Types.ObjectId) =>
            LikeUserId.toString() !== CurrentUserId
        );

        if (!IsPostOwner) {
          await User.updateOne(
            { _id: FoundPost.userId, points: { $gt: 0 } },
            { $inc: { points: -1 } }
          );
        }
      } else {
        FoundPost.likes.push(FoundUser._id);

        if (!IsPostOwner) {
          await User.updateOne(
            { _id: FoundPost.userId },
            { $inc: { points: 1 } }
          );
        }
      }

      await FoundPost.save();

      return NextResponse.json(
        {
          Message: "Like updated",
          Post: FormatPost(FoundPost, CurrentUserId),
        },
        { status: 200 }
      );
    }

    if (Action === "addComment") {
      const CleanText = Text?.trim();

      if (!CleanText) {
        return NextResponse.json(
          { Message: "Comment cannot be empty" },
          { status: 400 }
        );
      }

      const HasCommentedBefore = FoundPost.comments.some(
        (CommentItem: PostComment) =>
          CommentItem.userId.toString() === CurrentUserId
      );

      FoundPost.comments.unshift({
        userId: FoundUser._id,
        username: FoundUser.username,
        profileImage: FoundUser.profileImage || DefaultProfileImage,
        content: CleanText,
      });

      FoundPost.commentCount = FoundPost.comments.length;
      await FoundPost.save();

      if (!HasCommentedBefore && !IsPostOwner) {
        await User.updateOne(
          { _id: FoundPost.userId },
          { $inc: { points: 1 } }
        );
      }

      return NextResponse.json(
        {
          Message: "Comment added",
          Comment: FormatComment(FoundPost.comments[0]),
          Post: FormatPost(FoundPost, CurrentUserId),
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ Message: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Post update error:", error);

    return NextResponse.json(
      {
        Message: "Server error",
        Error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
