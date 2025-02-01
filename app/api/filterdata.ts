import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/connectdb";
import Transaction from "@/models/transactions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect(); // Connect to MongoDB

    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "Start date and end date are required" });
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

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

    return res.status(200).json({
      metrics: {
        totalTransactions,
        totalRevenue,
      },
      pieData,
      barData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
