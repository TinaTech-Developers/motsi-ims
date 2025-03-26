import { NextResponse } from "next/server";
import dbConnect from "../../../config/database";
import vehicleData from "../../../models/vehicledata";

// GET Method to retrieve all vehicle data
export async function GET(req) {
  try {
    await dbConnect();
    const vehicleDataAll = await vehicleData.find().lean().exec();

    return NextResponse.json({ data: vehicleDataAll || [] }, { status: 200 });
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

// DELETE Method to delete vehicle data by ID
export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await dbConnect();
  await vehicleData.findByIdAndDelete(id);
  return NextResponse.json(
    { message: "Insurance Successfully Deleted" },
    { status: 201 }
  );
}

// POST Method to add new vehicle data
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
export async function PUT(req) {
  const id = req.nextUrl.searchParams.get("id"); // Extract 'id' from the URL query params
  const { zinaraend } = await req.json(); // Extract 'zinaraend' from the request body

  // Check if both id and zinaraend are provided
  if (!id || !zinaraend) {
    return NextResponse.json(
      { message: "Vehicle ID and new zinaraend value are required." },
      { status: 400 }
    );
  }

  await dbConnect();

  try {
    // Find and update the vehicle data by ID, only updating the zinaraend field
    const updatedVehicle = await vehicleData.findByIdAndUpdate(
      id,
      { zinaraend }, // Only update the zinaraend field
      { new: true } // Return the updated vehicle
    );

    // If the vehicle is not found, return an error message
    if (!updatedVehicle) {
      return NextResponse.json(
        { message: "Vehicle data not found." },
        { status: 404 }
      );
    }

    // Successfully updated the vehicle data
    return NextResponse.json(
      { message: "Vehicle data updated successfully.", data: updatedVehicle },
      { status: 200 }
    );
  } catch (error) {
    // Log the error message with more details
    console.error("PUT Error:", error);

    // Return the error message in the response
    return NextResponse.json(
      {
        message: "Error updating vehicle.",
        error: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
