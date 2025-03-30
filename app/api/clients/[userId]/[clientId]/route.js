import mongoose from "mongoose";
import { NextResponse } from "next/server"; // Ensure this is imported for the response
import dbConnect from "../../../../../config/database"; // Adjust according to your file structure
// Adjust the path as needed
import Clients from "../../../../../models/clients"; // Adjust the path as needed

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

    // Clean up the clientId and cast to ObjectId
    const cleanedClientId = clientId.trim();
    const objectId = mongoose.Types.ObjectId.isValid(cleanedClientId)
      ? new mongoose.Types.ObjectId(cleanedClientId) // Use 'new' to create ObjectId
      : null;

    if (!objectId) {
      return NextResponse.json(
        { message: "Invalid Client ID format." },
        { status: 400 }
      );
    }

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
      { userId, _id: objectId }, // Use the cleaned and casted ObjectId
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
