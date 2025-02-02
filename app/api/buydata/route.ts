import { NextRequest, NextResponse } from "next/server";
import { buyData } from "@/utils/api";
import {
  createTransaction,
  updateTransactionStatus,
} from "@/utils/transactions";
import { extractPlanDetails, generateReferenceId } from "@/utils/junkfunctions";

export function exportTransactionStatus(status: String) {
  return { status };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      network,
      planType,
      apiDetails,
      mobileNumber,
      bypass,
      plan,
      userId,
    } = body.data;

    let network_id = "";
    switch (network) {
      case "MTN":
        network_id = "1";
        break;
      case "Airtel":
        network_id = "2";
        break;
      case "9mobile":
        network_id = "4";
        break;
      default:
        network_id = "3";
    }

    let provider = "BELLO_SME";
    if (apiDetails[0].apiName === "Bello") {
      if (
        network === "MTN" &&
        ["SME", "SME2", "Data Share"].includes(planType)
      ) {
        provider = "BELLO_SME";
      } else if (
        network === "MTN" &&
        ["Corporate Gifting", "Gifting"].includes(planType)
      ) {
        provider = "BELLO_CG";
      } else if (
        ["Airtel", "9mobile", "Glo"].includes(network) &&
        ["Corporate Gifting", "Gifting", "SME"].includes(planType)
      ) {
        provider = "BELLO_GENERAL";
      }
    }

    const plan_id = apiDetails[0].apiId;
    const type = "DataTransaction";
    const referenceId = await generateReferenceId();
    const { plansize, amount } = await extractPlanDetails(plan);

    const DataTransactions = {
      userId,
      type,
      amount,
      referenceId,
      refund: false,
      status: "Pending",
      plansize,
      planType,
      bypass,
      mobileNumber,
      medium: "API",
      network,
    };

    const transaction = await createTransaction(DataTransactions);
    const result = await buyData(provider, network_id, mobileNumber, plan_id);

    if (result.status === true) {
      transaction.status = "Successful";
    } else {
      transaction.status = "Failed";
    }
    await updateTransactionStatus(
      referenceId,
      type,
      transaction.status,
      amount
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
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
