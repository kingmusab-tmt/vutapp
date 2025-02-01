// pages/api/reserve-account.ts
import { NextRequest, NextResponse } from "next/server";
import { getMonnifyToken } from "@/utils/monnify";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { accountReference, accountName, customerEmail, customerName, bvn } =
      body;
    const accessToken = await getMonnifyToken();

    const response = await axios.post(
      "https://api.monnify.com/api/v2/bank-transfer/reserved-accounts",
      {
        accountReference,
        accountName,
        currencyCode: "NGN",
        contractCode: process.env.MONNIFY_CONTRACT_CODE,
        customerEmail,
        bvn,
        customerName,
        getAllAvailableBanks: true,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
