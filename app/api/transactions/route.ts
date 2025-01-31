import Transaction from "@/models/transactions";
import dbConnect from "@/lib/connectdb";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";


export const dynamic = 'force-dynamic';
export async function GET(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const body = await req.nextUrl.searchParams;
  const sortField = body.get("sortField") || "date";
  const sortOrder = body.get("sortOrder") || "desc";
  const transactionType = body.get("transactionType");
  const transactionStatus = body.get("transactionStatus");

  const sort: { [key: string]: "asc" | "desc" } = {};
  sort[sortField] = sortOrder === "desc" ? "desc" : "asc";

  let filters: any = {};
  if (session?.user?.role === "Admin") {
    filters = filters;
    // session?.user?.role === "Admin" ? {} :
  } else if (session?.user?.role === "User") {
    // Fetch transactions for the current user
    filters.email = session.user.email;
  }
  if (transactionType) filters.paymentMethod = transactionType;
  if (transactionStatus) filters.status = transactionStatus;

  try {
    const transactions = await Transaction.find(filters).sort([[sortField, sortOrder as "asc" | "desc"]]);
    return NextResponse.json({ success: true, transactions, status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to Fetch Transaction", details: error },
      { status: 500 }
    );
  }
}

// export async function PUT(req, res) {
//   const { id } = req.query;

//   await dbConnect();

//   try {
//     const { status } = req.body;
//     const transaction = await Transaction.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true }
//     );
//     if (!transaction) {
//       return res.status(404).json({ message: "Transaction not found" });
//     }
//     res.status(200).json(transaction);
//   } catch (error) {
//     res.status(400).json({ message: "Failed to update transaction status" });
//   }
// }
