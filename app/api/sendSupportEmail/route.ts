import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";
export const POST = async (req: NextRequest) => {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  const body = await req.json();
  console.log(body);
  const { email, name, phone, subject, message } = body;

  const transporter = nodemailer.createTransport({
    host: "mail.triplemultipurposetechnology.com.ng",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.COMPANY_EMAIL_USER,
      to: process.env.SUPPORT_EMAIL,
      replyTo: email,
      subject: `Support Request from ${name}: ${subject}`,
      text: `My name is ${name} and my phone number is ${phone} kindly provide answer to: ${message}`,
    });

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error sending email", error },
      { status: 500 }
    );
  }
};
