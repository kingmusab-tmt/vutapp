import mongoose, { Schema, Document, model } from "mongoose";

export interface IManualWithdrawal extends Document {
  username: string; // The username of the user making the withdrawal
  amount: number; // The amount being withdrawn
  previousBalance: number; // The balance before the withdrawal
  balanceAfter: number; // The balance after the withdrawal
  reason: string; // Reason for the withdrawal
  pendingAmount: number; // Pending amount if any
}

const manualWithdrawalSchema = new Schema<IManualWithdrawal>(
  {
    username: { type: String, required: true },
    amount: { type: Number, required: true },
    previousBalance: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    reason: { type: String, required: true },
    pendingAmount: { type: Number, default: 0 },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Create the model if it doesn't already exist
const ManualWithdrawal =
  mongoose.models.ManualWithdrawal ||
  model<IManualWithdrawal>("ManualWithdrawal", manualWithdrawalSchema);

export default ManualWithdrawal;
