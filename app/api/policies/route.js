import dbConnect from "@/config/database";
import policies from "@/models/policies";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();
    const allPolicies = await policies.find().lean().exec();
    return NextResponse.json({ data: allPolicies || [] }, { status: 200 });
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

// DELETE

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await dbConnect();
  await policies.findByIdAndDelete(id);
  return NextResponse.json(
    { message: "Policy deleted successfully" },
    { status: 201 }
  );
}

// POST

export async function POST(req) {
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
