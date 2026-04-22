// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
// import User from "@/models/User";

// export async function POST(req: Request) {
//   try {
//     await connectDB();

//     const body = await req.json();
//     const { email, password } = body;

//     if (!email || !password) {
//       return NextResponse.json(
//         { message: "Email and password required" },
//         { status: 400 }
//       );
//     }

//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       return NextResponse.json(
//         { message: "User already exists" },
//         { status: 409 }
//       );
//     }

//     const newUser = await User.create({
//       email,
//       password
//     });

//     return NextResponse.json(
//       { message: "User created", user: newUser },
//       { status: 201 }
//     );

//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       { message: "Server error" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { Username, Email, Password } = body;

    console.log("Signup API hit");
    console.log({ Username, Email, hasPassword: !!Password });

    const CleanUsername = Username?.trim();
    const CleanEmail = Email?.trim().toLowerCase();
    const CleanPassword = Password?.trim();

    if (!CleanUsername || !CleanEmail || !CleanPassword) {
      return NextResponse.json(
        { Message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (CleanUsername.length < 5) {
      return NextResponse.json(
        { Message: "Username must be at least 5 characters long" },
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

    const ExistingUser = await User.findOne({
      $or: [{ email: CleanEmail }, { username: CleanUsername }],
    });

    console.log("Existing user result:", ExistingUser);

    if (ExistingUser) {
      return NextResponse.json(
        { Message: "User with this email or username already exists" },
        { status: 409 }
      );
    }

    const PasswordHash = await bcrypt.hash(CleanPassword, 12);

    await User.create({
      username: CleanUsername,
      email: CleanEmail,
      passwordHash: PasswordHash,
    });

    return NextResponse.json(
      { Message: "Account created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Signup route error:", error);

    const DuplicateKey =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000;

    if (DuplicateKey) {
      return NextResponse.json(
        { Message: "User with this email or username already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        Message: "Server error",
        Error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
