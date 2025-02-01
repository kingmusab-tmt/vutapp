import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/connectdb";
import Transaction from "@/models/transactions";

export async function GET(req: NextRequest) {
  try {
    await dbConnect(); // Connect to MongoDB

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Start date and end date are required" },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Fetch transactions within the date range
    const transactions = await Transaction.find({
      date: { $gte: start, $lte: end },
    });

    // Calculate metrics
    const totalTransactions = transactions.length;
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const pieData = transactions.reduce((acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    const barData = transactions.reduce((acc, t) => {
      const month = t.date.getMonth(); // Get month index
      acc[month] = (acc[month] || 0) + 1; // Count transactions by month
      return acc;
    }, {} as Record<number, number>);

    return NextResponse.json(
      {
        metrics: {
          totalTransactions,
          totalRevenue,
        },
        pieData,
        barData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
