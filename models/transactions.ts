import mongoose, { Schema, Document, model } from "mongoose";

export interface ITransaction extends Document {
  type: string; // "CableSubscription", "BillPayment", "ManualFunding", "AutomaticFunding", "DataTransaction", "AirtimeTransaction"
  amount?: number; // General transaction amount
  balanceBefore: number; // Balance before transaction
  balanceAfter: number; // Balance after transaction
  status: string; // "Pending", "Successful", "Failed"
  userId?: string;
  bypass: boolean;
  referenceId: string;

  // Airtime Transaction Fields
  airtimeType: string;
  buyingPrice: number;
  // Cable Subscription Fields
  iucOrSmartcardNumber?: number;
  cableId?: number;
  cablePlanId?: number;
  refund?: boolean;

  // Bill Payment Fields
  meterNumber?: number;
  token?: string;
  customerPhone?: number;
  meterType?: string;
  reference?: string;
  customerName?: string;
  customerAddress?: string;
  discoNameId?: number;

  // Data Transaction Fields
  planType?: string;
  plansize: string;
  mobileNumber?: number;
  medium?: string; // e.g., "API", "Web"
  network?: string;

  // Funding Transaction Fields
  fundingType?: "Manual" | "Automatic"; // Specific to funding transactions
  fundingSource?: "API" | "Admin";
}

const transactionSchema = new Schema<ITransaction>(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "CableSubscription",
        "BillPayment",
        "ManualFunding",
        "AutomaticFunding",
        "DataTransaction",
        "AirtimeTransaction",
      ],
    },
    amount: { type: Number },
    balanceBefore: { type: Number },
    balanceAfter: { type: Number },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Successful", "Failed"],
    },
    referenceId: { type: String, unique: true },

    // Airtime Subscription Field
    airtimeType: { type: String },
    buyingPrice: { type: Number },

    // Cable Subscription Fields
    iucOrSmartcardNumber: { type: Number },
    reference: { type: String },
    cableId: { type: Number },
    cablePlanId: { type: Number },
    userId: { type: String },
    refund: { type: Boolean, default: false },
    bypass: { type: Boolean, default: false },

    // Bill Payment Fields
    meterNumber: { type: Number },
    token: { type: String },
    customerPhone: { type: Number },
    meterType: { type: String },
    customerName: { type: String },
    customerAddress: { type: String },
    discoNameId: { type: Number },

    // Data Transaction Fields
    planType: { type: String },
    mobileNumber: { type: Number },
    medium: { type: String },
    network: { type: String },
    plansize: { type: String },

    // Funding Transaction Fields
    fundingType: { type: String, enum: ["Manual", "Automatic"] },

    fundingSource: { type: String, enum: ["API", "Admin"] },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Create the model if it doesn't already exist
const Transaction =
  mongoose.models.Transaction ||
  model<ITransaction>("Transaction", transactionSchema);

export default Transaction;
