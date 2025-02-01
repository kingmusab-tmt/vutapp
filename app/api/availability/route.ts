import dbConnect from "@/lib/connectdb";
import {
  DataPlan,
  AirtimePlan,
  CableSubscription,
  BillPayment,
} from "@/models/dataAirtimeUtil";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  await dbConnect(); // Ensure the database is connected

  try {
    const { network, planType, airtimeType, cableType, billType, available } =
      await req.json();

    let model;
    let filter = {};
    const update = { $set: { available } };

    if (network && planType) {
      model = DataPlan;
      filter = { network, planType };
    } else if (network && airtimeType) {
      model = AirtimePlan;
      filter = { network, airtimeType };
    } else if (cableType) {
      model = CableSubscription;
      filter = { cableType };
    } else if (billType) {
      model = BillPayment;
      filter = { billType };
    } else {
      return NextResponse.json(
        { error: "Invalid parameters." },
        { status: 400 }
      );
    }

    if (!model) {
      return NextResponse.json(
        { error: "Invalid model selection." },
        { status: 400 }
      );
    }

    const result = await model.updateMany(filter, update);

    if (result.modifiedCount > 0) {
      return NextResponse.json(
        { message: "Availability updated successfully." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "No matching record found." },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while updating the availability." },
      { status: 500 }
    );
  }
}
