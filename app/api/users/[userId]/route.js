import { NextResponse } from "next/server";
import dbConnect from "../../../../config/database";
import User from "../../../../models/user";

export async function GET(req, { params }) {
  const { userId } = params; // No need to await params

  try {
    await dbConnect();

    const user = await User.findById(userId).select("-password"); // Exclude password
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("User fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
