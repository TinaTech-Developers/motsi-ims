import dbConnect from "../../../../config/database";
import vehicleData from "../../../../models/vehicledata";
import { NextRequest, NextResponse } from "next/server";

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

    // Fetch user data from the vehicleData collection
    const userData = await vehicleData.find({ userId }).lean().exec();

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

export async function POST(req, { params }) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required.", error: "Missing userId parameter." },
      { status: 400 }
    );
  }

  try {
    await dbConnect(); // Connect to database

    const body = await req.json(); // Parse request body
    const {
      vehiclereg,
      ownername,
      zinarastart,
      zinaraend,
      expiresIn,
      phonenumber,
      premium,
      insurance,
    } = body;

    // Validate all required fields
    if (
      !vehiclereg ||
      !ownername ||
      !zinarastart ||
      !zinaraend ||
      !expiresIn ||
      !phonenumber ||
      !insurance ||
      premium == null
    ) {
      return NextResponse.json(
        { message: "All fields are required.", error: "Missing data." },
        { status: 400 }
      );
    }

    // Create and save new insurance data
    const newData = new vehicleData({
      userId,
      vehiclereg,
      ownername,
      zinarastart,
      zinaraend,
      expiresIn,
      phonenumber,
      premium,
      insurance,
    });

    await newData.save();

    return NextResponse.json(
      { message: "Data saved successfully.", data: newData },
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

// please give me a working code, its been 5hours now you giving me the code that is not working. am getting this: npm run build

// > motsi-insurance@0.1.0 build
// > next build

//    ▲ Next.js 15.2.0
//    - Environments: .env

//    Creating an optimized production build ...
//  ✓ Compiled successfully
//    Linting and checking validity of types  .Failed to compile.

// app/api/data/[userId]/route.ts
// Type error: Route "app/api/data/[userId]/route.ts" has an invalid "GET" export:
//   Type "{ params: { userId: string; }; }" is not a valid type for the function's second argument.

// Next.js build worker exited with code: 1 and signal: null. here is the code: import { NextRequest, NextResponse } from "next/server";
// import dbConnect from "../../../../config/database";
// import vehicleData from "../../../../models/vehicledata";

// interface ErrorResponse {
//   message: string;
//   error: string;
// }

// interface SuccessResponse<T> {
//   message?: string;
//   data: T;
// }

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { userId: string } } // Inline typing, Next.js compatible
// ) {
//   const { userId } = params;

//   if (!userId) {
//     return NextResponse.json(
//       { message: "User ID is required." },
//       { status: 400 }
//     );
//   }

//   try {
//     await dbConnect();

//     const userData = await vehicleData.find({ userId }).lean().exec();

//     return NextResponse.json({ data: userData || [] }, { status: 200 });
//   } catch (error: unknown) {
//     console.error("GET Error:", error);

//     const errorMessage =
//       error instanceof Error ? error.message : "Unknown error occurred.";

//     return NextResponse.json(
//       { message: "Internal server error.", error: errorMessage },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(
//   req: NextRequest,
//   { params }: { params: { userId: string } } // Same inline typing here
// ) {
//   const { userId } = params;

//   try {
//     await dbConnect();

//     const body = await req.json();
//     const {
//       vehiclereg,
//       ownername,
//       zinarastart,
//       zinaraend,
//       expiresIn,
//       phonenumber,
//       premium,
//     } = body;

//     if (
//       !vehiclereg ||
//       !ownername ||
//       !zinarastart ||
//       !zinaraend ||
//       !expiresIn ||
//       !phonenumber ||
//       premium == null
//     ) {
//       return NextResponse.json<ErrorResponse>(
//         { message: "All fields are required.", error: "Missing data" },
//         { status: 400 }
//       );
//     }

//     const newData = new vehicleData({
//       userId,
//       vehiclereg,
//       ownername,
//       zinarastart,
//       zinaraend,
//       expiresIn,
//       phonenumber,
//       premium,
//     });

//     await newData.save();

//     return NextResponse.json<SuccessResponse<typeof newData>>(
//       { message: "Data saved successfully.", data: newData },
//       { status: 201 }
//     );
//   } catch (error: unknown) {
//     const errorMessage =
//       error instanceof Error ? error.message : "Unknown error occurred.";

//     console.error("POST Error:", errorMessage);

//     const response: ErrorResponse = {
//       message: "Internal server error.",
//       error: errorMessage,
//     };

//     return NextResponse.json(response, { status: 500 });
//   }
// }
