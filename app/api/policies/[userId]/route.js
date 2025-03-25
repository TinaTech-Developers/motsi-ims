import dbConnect from "@/config/database";
import Policies from "../../../../models/policies";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ message: "User ID require" }, { status: 400 });
  }

  try {
    await dbConnect();

    const policies = await Policies.find({ userId }).lean().exec();
    if (!policies) {
      return NextResponse.json(
        {
          message: "No policies found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json({ data: policies }, { status: 200 });
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
    return NextResponse.json({ message: "User ID require" }, { status: 400 });
  }
  try {
    await dbConnect();
    const body = await req.json();
    const { policynumber, policyholder, policytype, expirydate } = body;
    if (!policynumber || !policyholder || !policytype || !expirydate) {
      return NextResponse.json(
        {
          message: "All fields are required",
        },
        { status: 400 }
      );
    }
    const newPolicy = new Policies({
      userId,
      policynumber,
      policyholder,
      policytype,
      expirydate,
    });
    await newPolicy.save();
    return NextResponse.json(
      {
        message: "Policy added successfully",
        data: newPolicy,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST error", error);
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
