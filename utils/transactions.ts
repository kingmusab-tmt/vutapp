import Transaction, { ITransaction } from "@/models/transactions";
import User from "@/models/user";
import dbConnect from "@/lib/connectdb";

interface CreateTransactionParams {
  type: string;
  amount: number;
  referenceId: string;
  userId: string;
  refund?: boolean;
  // Optional fields
  iucOrSmartcardNumber?: number;
  cableId?: number;
  cablePlanId?: number;
  meterNumber?: number;
  token?: string;
  customerPhone?: number;
  meterType?: string;
  customerName?: string;
  customerAddress?: string;
  planType?: string;
  discoNameId?: number;
  dataType?: string;
  mobileNumber?: number;
  medium?: string;
  portedNumber?: boolean;
  networkId?: number;
  airtimeType?: string;
  buyingPrice?: number;
  planId?: number;
  fundingType?: "Manual" | "Automatic";
  fundingSource?: "API" | "Admin";
}

export async function createTransaction(
  params: CreateTransactionParams
): Promise<ITransaction> {
  const { userId, type, amount, referenceId, refund, ...otherFields } = params;

  await dbConnect();

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const balanceBefore = user.accountBalance;
  let balanceAfter =
    type === "ManualFunding" || type === "AutomaticFunding"
      ? balanceBefore + amount
      : balanceBefore - amount;

  const transactionData = {
    userId,
    type,
    amount,
    referenceId,
    refund,
    status: "Pending",
    balanceBefore,
    balanceAfter,
    ...otherFields,
  };

  console.log(`This is the transaction data ${transactionData}`);

  const transaction = new Transaction(transactionData);
  await transaction.save();
  return transaction;
}

export async function updateTransactionStatus(
  referenceId: string,
  type: string,
  status: string,
  amount: number
): Promise<ITransaction> {
  await dbConnect();
  const transaction = await Transaction.findOne({ referenceId });
  if (!transaction) {
    throw new Error("Transaction not found");
  }

  const user = await User.findById(transaction.userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (status === "Successful") {
    transaction.balanceAfter =
      type === "ManualFunding" || type === "AutomaticFunding"
        ? transaction.balanceBefore + amount
        : transaction.balanceBefore - amount;
    user.accountBalance = transaction.balanceAfter;
  } else {
    transaction.balanceAfter = transaction.balanceBefore;
    transaction.refund = true;
    user.accountBalance = transaction.balanceBefore;
  }

  transaction.status = status;
  await transaction.save();
  await user.save();

  return transaction;
}
