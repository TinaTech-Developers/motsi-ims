import { NextResponse } from "next/server";
import dbConnect from "../../../../config/database";
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
    const calculateStatus = (endDate) => {
      const end = new Date(endDate);
      const today = new Date();
      const diffTime = end.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return "Expired";
      if (diffDays <= 30) return "About to Expire";
      return "Active";
    };
    const updatedUserData = userData.map((item) => ({
      ...item,
      expiresIn: calculateStatus(item.zinaraend),
    }));

    const clarionCount = updatedUserData.filter(
      (item) => item.insurance === "Clarion"
    ).length;

    return NextResponse.json(
      { data: updatedUserData, clarionCount },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET Error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred.";

    return NextResponse.json(
      { message: "Internal server error.", error: errorMessage },
      { status: 500 }
    );
  }
}

// POST handler to create a new client
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

    let body;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid JSON in request body.", error: error.message },
        { status: 400 }
      );
    }

    const {
      fullname,
      email,
      phone,
      vehicle,
      expirydate,
      regnumber,
      expiresIn,
    } = body;

    if (
      !fullname ||
      !email ||
      !phone ||
      !vehicle ||
      !expirydate ||
      !regnumber ||
      !expiresIn
    ) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // Create a new client and save to the database
    const newClient = new Clients({
      userId,
      fullname,
      email,
      phone,
      vehicle,
      expirydate,
      regnumber,
      expiresIn,
    });
    await newClient.save();

    // Respond with the new client data
    return NextResponse.json(
      { message: "Client added successfully.", data: newClient },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { message: "Internal server error.", error: error.message },
      { status: 500 }
    );
  }
}

//  put method

export async function PUT(req) {
  const id = req.nextUrl.searchParams.get("id");
  const { expirydate } = await req.json();

  if (!id || !expirydate) {
    return NextResponse.json(
      {
        message: "Vehicle ID and expirydate value are required",
      },
      {
        status: 400,
      }
    );
  }
  await dbConnect();

  try {
    const updatedClient = await Clients.findByIdAndUpdate(
      id,
      { expirydate },
      { new: true }
    );

    if (!updatedClient) {
      return NextResponse.json(
        { message: "Vehicle data not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        message: "Client expirydate successfully updated",
        data: updatedClient,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Put Error", error);

    return NextResponse.json(
      {
        message: "Error Updating Client",
        error: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
