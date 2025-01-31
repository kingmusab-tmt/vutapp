import mongoose, { Schema, Document, model } from "mongoose";

export interface ITransaction extends Document {
  type: string; // "CableSubscription", "BillPayment", "ManualFunding", "AutomaticFunding", "DataTransaction"
  amount?: number; // General transaction amount
  balanceBefore: number; // Balance before transaction
  balanceAfter: number; // Balance after transaction
  status: string; // "Pending", "Successful", "Failed"
  createDate: Date; // Date of the transaction

  // Cable Subscription Fields
  iucOrSmartcardNumber?: number;
  planAmount?: number;
  cableId?: number;
  cablePlanId?: number;
  userId?: string;
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
  dataType?: string;
  mobileNumber?: number;
  medium?: string; // e.g., "API", "Web"
  portedNumber?: boolean;
  networkId?: number;
  planId?: number;

  // Funding Transaction Fields
  fundingType?: "Manual" | "Automatic"; // Specific to funding transactions
}

const transactionSchema = new Schema<ITransaction>(
  {
    type: { type: String, required: true, enum: ["CableSubscription", "BillPayment", "ManualFunding", "AutomaticFunding", "DataTransaction"] },
    amount: { type: Number },
    balanceBefore: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    status: { type: String, required: true, enum: ["Pending", "Successful", "Failed"] },
    createDate: { type: Date, default: Date.now },

    // Cable Subscription Fields
    iucOrSmartcardNumber: { type: Number, required: true },
    planAmount: { type: Number },
    reference: { type: String },
    cableId: { type: Number },
    cablePlanId: { type: Number },
    userId: { type: String },
    refund: { type: Boolean, default: false },

    // Bill Payment Fields
    meterNumber: { type: Number },
    token: { type: String },
    customerPhone: { type: Number },
    meterType: { type: String },
    customerName: { type: String },
    customerAddress: { type: String },
    discoNameId: { type: Number },

    // Data Transaction Fields
    dataType: { type: String },
    mobileNumber: { type: Number },
    medium: { type: String },
    portedNumber: { type: Boolean },
    networkId: { type: Number },
    planId: { type: Number },

    // Funding Transaction Fields
    fundingType: { type: String, enum: ["Manual", "Automatic"] },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Create the model if it doesn't already exist
const Transaction = mongoose.models.Transaction || model<ITransaction>("Transaction", transactionSchema);

export default Transaction;
