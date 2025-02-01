import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const eventData = await req.json();

    // Handle different webhook events
    switch (eventData.eventType) {
      case "TRANSACTION_SUCCESS":
        console.log("Payment Successful:", eventData.eventData);
        break;
      case "TRANSACTION_FAILURE":
        console.log("Payment Failed:", eventData.eventData);
        break;
      default:
        console.log("Unhandled Event:", eventData.eventType);
    }

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
