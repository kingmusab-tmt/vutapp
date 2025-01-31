// import type { NextApiRequest, NextApiResponse } from "next";
// import dbConnect from "@/utils/connectDB";
// import Property from "@/models/properties";
// import User from "@/models/user";
// import Transaction from "@/models/transaction";
// import { NextResponse } from "next/server";

// const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
// export const dynamic = "force-dynamic";
// export async function POST(req) {
//   if (req.method !== "POST") {
//     return NextResponse.json(
//       { message: "Method not allowed" },
//       { status: 405 }
//     );
//   }

//   await dbConnect();

//   const event = await req.json();
//   // console.log(req.headers);
//   // console.log(event);

//   const headers = new Headers(req.headers);
//   const secret = headers.get("x-paystack-signature");

//   const crypto = require("crypto");
//   const hash = crypto
//     .createHmac("sha512", PAYSTACK_SECRET_KEY)
//     .update(JSON.stringify(event))
//     .digest("hex");

//   console.log(req.headers);
//   console.log(secret);
//   console.log(hash);
//   if (hash !== secret) {
//     return NextResponse.json(
//       { message: "Webhook Error: Invalid signature" },
//       { status: 400 }
//     );
//   }

//   // const event = JSON.parse(buf.toString());

//   if (event.event === "charge.success") {
//     const { reference, status, amount } = event.data;

//     const transaction = await Transaction.findOne({ reference });

//     if (transaction) {
//       transaction.status = status === "success" ? "successful" : "failed";
//       await transaction.save();
//     }
//   }
//   return NextResponse.json({ received: true }, { status: 200 });
// }
// pages/api/webhook.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const eventData = req.body;

    // Handle different webhook events
    switch (eventData.eventType) {
      case 'TRANSACTION_SUCCESS':
        console.log('Payment Successful:', eventData.eventData);
        break;
      case 'TRANSACTION_FAILURE':
        console.log('Payment Failed:', eventData.eventData);
        break;
      default:
        console.log('Unhandled Event:', eventData.eventType);
    }

    res.status(200).json({ status: 'success' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}