import { NextResponse } from "next/server";
import dbConnect from "../../../config/database";
import User from "../../../models/user";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, password, role, fullname } = await req.json();

    // Validate input
    if (!email || !password || !role || !fullname) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    if (!["admin", "manager"].includes(role)) {
      return NextResponse.json({ message: "Invalid role." }, { status: 400 });
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists." },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role,
      fullname,
    });

    return NextResponse.json(
      {
        message: "User registered successfully.",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
