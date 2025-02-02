import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/connectdb";
import { AirtimePlan } from "@/models/dataAirtimeUtil";

export async function GET(req: NextRequest) {
  try {
    await dbConnect(); // Ensure database connection

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const network = searchParams.get("network");
    const airtimeType = searchParams.get("airtimeType");

    // Validate parameters
    if (!network || !airtimeType) {
      return NextResponse.json(
        { error: "Missing required parameters: network and airtimeType" },
        { status: 400 }
      );
    }

    // Fetch airtime plan from the database
    const plan = await AirtimePlan.findOne({ network, airtimeType });

    if (!plan) {
      return NextResponse.json(
        { error: "Airtime plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(plan, { status: 200 });
  } catch (error) {
    console.error("Error fetching airtime plan:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
