import dbConnect from "@/lib/connectdb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");
  const email = req.nextUrl.searchParams.get("email");
  const bvnOrNin = req.nextUrl.searchParams.get("bvnOrNin");
  const phoneNumber = req.nextUrl.searchParams.get("phoneNumber");
  await dbConnect();

  let filterUser = {};
  if (username) {
    filterUser = { username };
  } else if (email) {
    filterUser = { email };
  } else if (bvnOrNin) {
    filterUser = { bvnOrNin };
  } else if (phoneNumber) {
    filterUser = { phoneNumber };
  }

  try {
    const user = await User.findOne(filterUser).lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
