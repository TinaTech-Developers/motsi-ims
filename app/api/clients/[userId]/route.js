import mongoose from "mongoose";
import { NextResponse } from "next/server"; // Ensure this is imported for the response
import dbConnect from "../../../../config/database"; // Adjust according to your file structure
// Adjust the path as needed
import Clients from "../../../../models/clients"; // Adjust the path as needed

// GET handler to fetch clients based on userId
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

    // Fetch clients from the database
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

    // Validate request body
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

    // Check if all required fields are present
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

// PUT handler to update expirydate of a specific client
export async function PUT(req, { params }) {
  const { userId, clientId } = params;

  if (!userId || !clientId) {
    return NextResponse.json(
      { message: "User ID and Client ID are required." },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    // Validate request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid JSON in request body.", error: error.message },
        { status: 400 }
      );
    }

    const { expirydate } = body;

    // Check if the expirydate is provided
    if (!expirydate) {
      return NextResponse.json(
        { message: "Expirydate is required." },
        { status: 400 }
      );
    }

    // Find and update the client
    const updatedClient = await Clients.findOneAndUpdate(
      { userId, _id: clientId }, // Find client by userId and clientId (MongoDB _id)
      { expirydate }, // Update expirydate field
      { new: true } // Return the updated document
    );

    if (!updatedClient) {
      return NextResponse.json(
        { message: "Client not found." },
        { status: 404 }
      );
    }

    // Respond with the updated client data
    return NextResponse.json(
      { message: "Expiry date updated successfully.", data: updatedClient },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { message: "Internal server error.", error: error.message },
      { status: 500 }
    );
  }
}
