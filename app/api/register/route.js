import { NextResponse } from "next/server";
import dbConnect from "../../../config/database";
import User from "../../../models/user";
import bcrypt from "bcryptjs";

// POST Method for User Registration
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

// GET Method to Fetch All Users
export async function GET(req) {
  try {
    await dbConnect();
    const allUsers = await User.find().lean().exec();
    return NextResponse.json({ data: allUsers }, { status: 201 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error.";
    console.error("GET Error:", errorMessage);
    return NextResponse.json(
      { message: "Internal server error.", error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE Method to Delete a User
export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User Deleted Successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

// PUT Method to Update Password and Role
export async function PUT(req) {
  try {
    const { userId, password, role } = await req.json();

    // Validate input
    if (!userId || !role) {
      return NextResponse.json(
        { message: "User ID, password, and role are required." },
        { status: 400 }
      );
    }

    if (!["admin", "manager"].includes(role)) {
      return NextResponse.json({ message: "Invalid role." }, { status: 400 });
    }

    await dbConnect();

    // Find the user by userId (assuming userId is provided)
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user details
    user.password = hashedPassword;
    user.role = role;

    // Save the updated user
    await user.save();

    return NextResponse.json(
      { message: "User updated successfully.", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
