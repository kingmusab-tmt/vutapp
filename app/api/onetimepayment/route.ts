import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const {
        amount,
        customerName,
        customerEmail,
        paymentReference,
        redirectUrl,
      } = req.body;
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

      res.status(200).json(response.data);
    } catch (error) {
      console.log(error);
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end("Method Not Allowed");
  }
}
