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
