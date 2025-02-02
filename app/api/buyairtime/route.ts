import { NextRequest, NextResponse } from "next/server";
import { purchaseAirtime } from "@/utils/vtpass";
import { generateRequestId } from "@/utils/junkfunctions";
import {
  createTransaction,
  updateTransactionStatus,
} from "@/utils/transactions";

export async function POST(req: NextRequest) {
  try {
    const {
      network,
      airtimeType,
      amount,
      phone,
      bypass,
      userId,
      userType,
      airtimePlan,
    } = await req.json();

    // Map network to VTpass service ID
    const serviceID = network.toLowerCase(); // e.g., "mtn", "airtel"
    const request_id = await generateRequestId();
    const type = "AirtimeTransaction";
    const referenceId = request_id;
    console.log(airtimePlan);

    let newAmount = amount;
    if (
      userType === "Smart Earner" &&
      airtimePlan.airtimeType === airtimeType
    ) {
      newAmount = amount - (airtimePlan.smartEarnerPercent / 100) * amount;
    } else if (
      userType === "Top User" &&
      airtimePlan.airtimeType === airtimeType
    ) {
      newAmount = amount - (airtimePlan.topUserPercent / 100) * amount;
    } else if (
      userType === "Affiliate User" &&
      airtimePlan.airtimeType === airtimeType
    ) {
      newAmount = amount - (airtimePlan.affiliatePercent / 100) * amount;
    } else if (
      userType === "API User" &&
      airtimePlan.airtimeType === airtimeType
    ) {
      newAmount = amount - (airtimePlan.apiPercent / 100) * amount;
    }

    const AirtimeTransactions = {
      userId,
      type,
      amount: newAmount,
      referenceId,
      refund: false,
      status: "Pending",
      airtimeType,
      bypass,
      mobileNumber: phone,
      network,
    };

    const transaction = await createTransaction(AirtimeTransactions);
    const result = await purchaseAirtime({
      request_id,
      serviceID,
      phone,
      amount,
    });

    if (
      result.code === "000" &&
      result.content.transactions.status === "delivered"
    ) {
      transaction.status = "Successful";
    } else if (
      result.code === "000" &&
      result.content.transactions.status === "pending"
    ) {
      transaction.status = "Pending";
    } else if (
      result.code === "016" &&
      result.content.transactions.status === "failed"
    ) {
      transaction.status = "Failed";
    }
    const response = transaction.status;
    await updateTransactionStatus(
      referenceId,
      type,
      transaction.status,
      newAmount
    );

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
