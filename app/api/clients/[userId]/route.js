import dbConnect from "../../../../config/database";
import { NextResponse } from "next/server";
import Clients from "../../../../models/clients";

export async function GET(req, { params }) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required." },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const userData = await Clients.find({ userId }).lean().exec();

    // Log retrieved data for debugging
    console.log("Fetched Clients:", userData);

    return NextResponse.json({ data: userData || [] }, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      {
        message: "Internal server error.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required.", error: "Missing userId parameter." },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const body = await req.json();
    const { fullname, email, phone, vehicle } = body;

    if (!fullname || !email || !phone || !vehicle) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    const newClient = new Clients({ userId, fullname, email, phone, vehicle });
    await newClient.save();

    return NextResponse.json(
      { message: "Client added successfully.", data: newClient },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
