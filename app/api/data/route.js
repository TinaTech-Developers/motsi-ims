import { NextResponse } from "next/server";
import dbConnect from "../../../config/database";
import vehicleData from "../../../models/vehicledata";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required." },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const userData = await vehicleData.find({ userId }).lean().exec();

    return NextResponse.json({ data: userData || [] }, { status: 200 });
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

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const {
      userId,
      vehiclereg,
      ownername,
      zinarastart,
      zinaraend,
      expiresIn,
      phonenumber,
      premium,
    } = body;

    if (
      !userId ||
      !vehiclereg ||
      !ownername ||
      !zinarastart ||
      !zinaraend ||
      !expiresIn ||
      !phonenumber ||
      premium == null
    ) {
      return NextResponse.json(
        { message: "All fields are required.", error: "Missing data" },
        { status: 400 }
      );
    }

    const newData = new vehicleData({
      userId,
      vehiclereg,
      ownername,
      zinarastart,
      zinaraend,
      expiresIn,
      phonenumber,
      premium,
    });

    await newData.save();

    return NextResponse.json(
      { message: "Data saved successfully.", data: newData },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error.";
    console.error("POST Error:", errorMessage);
    return NextResponse.json(
      { message: "Internal server error.", error: errorMessage },
      { status: 500 }
    );
  }
}
