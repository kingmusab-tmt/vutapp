import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/connectdb";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { resetCode, newPin } = await req.json();
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Initialize failed attempts if not present
    if (!user.failedResetAttempts) {
      user.failedResetAttempts = 0;
    }

    // Check if reset attempts exceeded
    if (user.failedResetAttempts >= 5) {
      const newResetCode = crypto.randomInt(100000, 999999).toString();
      user.transactionPinResetCode = newResetCode;
      user.transactionPinResetExpires = Date.now() + 10 * 60 * 1000;
      user.failedResetAttempts = 0;
      await user.save();

      // Send new reset code to email
      const transporter = nodemailer.createTransport({
        host: "mail.triplemultipurposetechnology.com.ng",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: "info@triplemultipurposetechnology.com.ng",
          pass: "Nevers@1994",
        },
      });

      await transporter.sendMail({
       from: '"SABAMUENT" <info@triplemultipurposetechnology.com.ng>',
      to: user.email,
        subject: "New Transaction PIN Reset Code",
        text: `Your reset code has been reset due to multiple incorrect attempts. Your new code: ${newResetCode} (Expires in 10 minutes).`,
      });

      return NextResponse.json({ error: "Too many failed attempts. A new reset code has been sent to your email." }, { status: 429 });
    }

    // 🔥 Debugging Logs
    console.log("Stored Reset Code:", user.transactionPinResetCode);
    console.log("Stored Expiry:", new Date(user.transactionPinResetExpires).getTime());
    console.log("Current Time:", Date.now());
    console.log("Received Reset Code:", resetCode);

    // Validate reset code
    if (
      !user.transactionPinResetCode ||
      String(user.transactionPinResetCode) !== String(resetCode) || // Ensure string comparison
      Date.now() > new Date(user.transactionPinResetExpires).getTime() // Fix Date comparison
    ) {
      user.failedResetAttempts += 1;
      await user.save();
      return NextResponse.json({ error: "Invalid or expired reset code" }, { status: 400 });
    }

    // Validate PIN format (5-digit numeric)
    const pinRegex = /^\d{5}$/;
    if (!pinRegex.test(newPin)) {
      return NextResponse.json({ error: "PIN must be exactly 5 digits" }, { status: 400 });
    }

    // Update transaction PIN and reset fields
    user.transactionPin = newPin;
    user.transactionPinResetCode = undefined;
    user.transactionPinResetExpires = undefined;
    user.failedResetAttempts = 0;
    await user.save();

    return NextResponse.json({ message: "Transaction PIN updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating transaction PIN:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
