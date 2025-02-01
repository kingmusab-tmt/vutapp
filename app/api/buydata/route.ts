import { NextRequest, NextResponse } from "next/server";
import { buyData } from "@/utils/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(`THis is the body: ${body}`);
    const { network, planType, apiDetails, phoneNumber, bypass } = body.data;
    console.log(`THis is the Network: ${network}`);
    console.log(`THis is the planType: ${planType}`);
    console.log(`THis is the apiName: ${apiDetails[0].apiName}`);
    console.log(`THis is the apiId: ${apiDetails[0].apiId}`);
    console.log(`THis is the phone: ${phoneNumber}`);

    let network_id = "";
    if (network === "MTN") {
      network_id = "1";
    } else if (network === "Airtel") {
      network_id = "2";
    } else if (network === "9mobile") {
      network_id = "4";
    } else {
      network_id = "3";
    }
    let provider = "";
    if (apiDetails[0].apiName === "Bello") {
      if (
        network === "MTN" &&
        (planType === "SME" || planType === "SME2" || planType === "Data Share")
      ) {
        provider = "BELLO_SME";
      } else if (
        network === "MTN" &&
        (planType === "Corporate Gifting" || planType === "Gifting")
      ) {
        provider = "BELLO_CG";
      } else if (
        network === "Airtel" &&
        (planType === "Corporate Gifting" || planType === "Gifting")
      ) {
        provider = "BELLO_GENERAL";
      } else if (
        network === "9mobile" &&
        (planType === "Corporate Gifting" || planType === "Gifting")
      ) {
        provider = "BELLO_GENERAL";
      } else if (
        network === "Glo" &&
        (planType === "Corporate Gifting" || planType === "Gifting")
      ) {
        provider = "BELLO_GENERAL";
      }
    } else {
      provider = "BELLO_SME";
    }
    const plan_id = apiDetails[0].apiId;
    const result = await buyData(provider, network_id, phoneNumber, plan_id);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error verifying NIN:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details:
          error instanceof Error ? error.message : "An unknown error occurred",
        stack: error instanceof Error ? error.stack : null,
      },
      { status: 500 }
    );
  }
}
