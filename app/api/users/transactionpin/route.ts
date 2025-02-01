import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/connectdb";
import User from "@/models/user";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    await dbConnect();

    // Get the authenticated user
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // Check if the user already has a transaction PIN
    if (user.hasTransactionPin) {
      return NextResponse.json(true, { status: 200 });
    }

    return NextResponse.json(false, { status: 200 });
  } catch (error) {
    console.error("Error checking transaction PIN:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { pin } = body;

    // Validate PIN (must be exactly 5 digits)
    const pinRegex = /^\d{5}$/;
    if (!pinRegex.test(pin)) {
      return NextResponse.json(
        { error: "PIN must be exactly 5 digits" },
        { status: 400 }
      );
    }

    // Get the authenticated user
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update the user's transaction PIN in MongoDB
    user.transactionPin = pin;
    user.hasTransactionPin = true;
    await user.save();

    return NextResponse.json(
      { hasPin: false, message: "Transaction PIN set successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error setting transaction PIN:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
