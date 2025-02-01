import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/connectdb";
import User from "@/models/user";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { getServerSession } from "next-auth";

export async function POST() {
  try {
    await dbConnect();
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate 6-digit reset code
    const resetCode = crypto.randomInt(100000, 999999);
    user.transactionPinResetCode = resetCode;
    user.transactionPinResetExpires = Date.now() + 10 * 60 * 1000; // Expires in 10 minutes
    await user.save();

    // Send email with reset code
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST!,
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_FROM!,
        pass: process.env.EMAIL_SERVER_PASSWORD!,
      },
    });

    await transporter.sendMail({
      from: '"TMTech" <info@triplemultipurposetechnology.com.ng>',
      to: user.email,
      subject: "Transaction PIN Reset Code",
      text: `Your transaction PIN reset code is: ${resetCode}\n\nThis code expires in 10 minutes.`,
    });

    return NextResponse.json(
      { message: "Reset code sent to email" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending reset code:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
