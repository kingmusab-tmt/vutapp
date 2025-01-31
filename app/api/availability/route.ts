import dbConnect from "@/lib/connectdb";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const { network, planType, airtimeType, cableType, billType, available } = await req.json();

  const db = await dbConnect();

  try {
    let collectionName = "";
    let filter = {};
    let update = { $set: { available } };

    if (network && planType) {
      // Handle Data Plans
      collectionName = "DataPlans";
      filter = { network, planType };
    } else if (network && airtimeType) {
      // Handle Airtime
      collectionName = "AirtimePlan";
      filter = { network, airtimeType };
    } else if (cableType) {
      // Handle Cable
      collectionName = "CableSubscription";
      filter = { cableType };
    } else if (billType) {
      // Handle Bills
      collectionName = "BillPayment";
      filter = { billType };
    } else {
      return NextResponse.json({ error: "Invalid parameters." }, { status: 400 });
    }

    console.log("this is the filter and update", filter, update);
      const collection = db.collection(collectionName);
      console.log("this is the collection", collection);
    //   console.log(collection, filter, update);
    const result = await collection.updateMany(filter, update)

    if (result.modifiedCount > 0) {
      return NextResponse.json({ message: "Availability updated successfully." }, { status: 200 });
    } else {
      return NextResponse.json({ error: "No matching record found." }, { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while updating the availability." },
      { status: 500 }
    );
  }
}
