import { NextResponse } from "next/server";
import dbConnect from "../../../../config/database";
import User from "../../../../models/user";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export async function PUT(req, { params }) {
  try {
    let { userId } = params;
    const { fullname, email, password, role } = await req.json();

    userId = userId.trim();

    // Basic validation
    if (!userId || !fullname || !email || !role) {
      return NextResponse.json(
        { message: "User ID, fullname, email, and role are required." },
        { status: 400 }
      );
    }

    if (!["admin", "manager"].includes(role)) {
      return NextResponse.json({ message: "Invalid role." }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid User ID." },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Update fields
    user.fullname = fullname;
    user.email = email;
    user.role = role;

    // Only update password if provided and not empty string
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    return NextResponse.json(
      { message: "User updated successfully.", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error occurred while updating the user:", error.message);
    return NextResponse.json(
      { message: "Internal server error.", error: error.message },
      { status: 500 }
    );
  }
}
