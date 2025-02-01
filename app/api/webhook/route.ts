import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const eventData = req.body;

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

    res.status(200).json({ status: "success" });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end("Method Not Allowed");
  }
}
