import dbConnect from "@/config/database";
import clientsClaims from "@/models/clientsClaims";
import { NextResponse } from "next/server";

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
    const clientClaims = await clientsClaims.find({ userId }).lean().exec();

    if (!clientClaims) {
      return NextResponse.json(
        { message: "No claims found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: clientClaims }, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      {
        message: "Internal server error.",
        error: error.message || "Unknown error.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json(
      {
        message: "User ID is missing",
      },
      { status: 400 }
    );
  }
  try {
    await dbConnect();
    const body = await req.json();
    const { clientname, policynumber, amount, details, submissiondate } = body;

    if (
      !clientname ||
      !policynumber ||
      !amount ||
      !details ||
      !submissiondate
    ) {
      return NextResponse.json(
        {
          message: "All fields required",
        },
        { status: 400 }
      );
    }

    const newClient = new clientsClaims({
      userId,
      clientname,
      policynumber,
      amount,
      details,
      submissiondate,
      status: false,
    });

    await newClient.save();
    return NextResponse.json(
      {
        message: "Client Claim Successfully saved",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      {
        message: "Internal server error.",
        error: error.message || "Unknown error.",
      },
      { status: 500 }
    );
  }
}
