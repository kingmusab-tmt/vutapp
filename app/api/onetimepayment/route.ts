import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      amount,
      customerName,
      customerEmail,
      paymentReference,
      redirectUrl,
    } = body;

    const authString = Buffer.from(
      `${process.env.MONNIFY_API_KEY}:${process.env.MONNIFY_SECRET_KEY}`
    ).toString("base64");

    const response = await axios.post(
      "https://api.monnify.com/api/v1/merchant/transactions/init-transaction",
      {
        amount,
        customerName,
        customerEmail,
        paymentReference,
        paymentDescription: "Payment for goods",
        currencyCode: "NGN",
        contractCode: process.env.MONNIFY_CONTRACT_CODE,
        redirectUrl,
      },
      {
        headers: {
          Authorization: `Basic ${authString}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
