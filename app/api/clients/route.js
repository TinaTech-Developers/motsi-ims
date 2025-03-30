import dbConnect from "@/config/database";
import Clients from "@/models/clients";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();
    const clientsAll = await Clients.find().lean().exec();

    return NextResponse.json({ data: clientsAll || [] }, { status: 200 });
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
  await Clients.findByIdAndDelete(id);
  return NextResponse.json(
    { message: "Client Successfully Deleted" },
    { status: 201 }
  );
}
