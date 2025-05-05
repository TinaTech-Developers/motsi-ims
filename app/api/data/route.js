import { NextResponse } from "next/server";
import dbConnect from "../../../config/database";
import vehicleData from "../../../models/vehicledata";

// // GET Method to retrieve all vehicle data
// export async function GET(req) {
//   try {
//     await dbConnect();
//     const vehicleDataAll = await vehicleData.find().lean().exec();

//     return NextResponse.json({ data: vehicleDataAll || [] }, { status: 200 });
//   } catch (error) {
//     const errorMessage =
//       error instanceof Error ? error.message : "Unknown error.";
//     console.error("GET Error:", errorMessage);
//     return NextResponse.json(
//       { message: "Internal server error.", error: errorMessage },
//       { status: 500 }
//     );
//   }
// }

export async function GET(req) {
  try {
    await dbConnect();

    // Fetch user data from the vehicleData collection
    const userData = await vehicleData.find().lean().exec();

    // Function to calculate status based on 'zinaraend' date
    const calculateStatus = (endDate) => {
      const end = new Date(endDate);
      const today = new Date();
      const diffTime = end.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return "Expired";
      if (diffDays <= 30) return "About to Expire";
      return "Active";
    };

    // Map over the user data and calculate 'expiresIn' for each item
    const updatedUserData = userData.map((item) => ({
      ...item,
      expiresIn: calculateStatus(item.zinaraend),
    }));

    // Count the number of 'Clarion' insurance policies
    const clarionCount = updatedUserData.filter(
      (item) => item.insurance === "Clarion"
    ).length;

    // Return both the insurance data and the clarion count
    return NextResponse.json(
      { data: updatedUserData, clarionCount }, // Include clarionCount in the response
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
      vehicleName,
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
      !vehicleName ||
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
      vehicleName,
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
  const { zinaraend, premium } = await req.json(); // Extract 'zinaraend' from the request body

  // Check if both id and zinaraend are provided
  if (!id || !zinaraend || !premium) {
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
      { zinaraend, premium }, // Only update the zinaraend an premium field

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
