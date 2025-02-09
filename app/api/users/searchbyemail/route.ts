import dbConnect from "@/lib/connectdb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export const dynamic = "force-dynamic";
export async function GET() {
  const session = await getServerSession();
  const email = session?.user?.email;

  if (typeof email !== "string") {
    return new NextResponse(JSON.stringify({ message: "Invalid Email" }), {
      status: 400,
    });
  }

  try {
    await dbConnect();
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { success: true, user }, // Include success and userId properties
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, error: "User not Found" }, // Include success and userId properties
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error }, // Include success and userId properties
      { status: 500 }
    );
  }
}
