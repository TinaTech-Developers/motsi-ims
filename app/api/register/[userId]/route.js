import { NextResponse } from "next/server";
import dbConnect from "../../../../config/database";
import User from "../../../../models/user";
import mongoose from "mongoose";

export async function PUT(req, { params }) {
  try {
    let { userId } = params; // Accessing dynamic userId from URL path
    const { role } = await req.json(); // Destructuring role from request body

    console.log("Received userId:", userId); // Log userId
    console.log("Received role:", role); // Log role

    // Trim userId to remove any whitespace or newline characters
    userId = userId.trim();

    // Validate input
    if (!userId || !role) {
      return NextResponse.json(
        { message: "User ID and role are required." },
        { status: 400 }
      );
    }

    if (!["admin", "manager"].includes(role)) {
      return NextResponse.json({ message: "Invalid role." }, { status: 400 });
    }

    // Ensure userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid User ID." },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find the user by userId (assuming userId is provided)
    const user = await User.findById(userId);
    console.log("User found:", user); // Log the user data
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Update the user's role
    user.role = role;

    // Save the updated user
    await user.save();

    return NextResponse.json(
      { message: "User updated successfully.", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error occurred while updating the user:", error.message);
    console.error("Stack trace:", error.stack);

    return NextResponse.json(
      { message: "Internal server error.", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    let { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required." },
        { status: 400 }
      );
    }

    // Clean up userId string
    userId = userId.trim();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid User ID." },
        { status: 400 }
      );
    }

    await dbConnect();

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
