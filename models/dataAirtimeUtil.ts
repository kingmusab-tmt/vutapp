import mongoose, { Schema, Document, model, Model } from "mongoose";

// Interfaces

export interface IApiDetail {
  apiName: string;
  apiId: string;
  apiIds: string[];
}

interface ISimHostingDetail {
  simHostingName: string;
  simHostingIds: string[];
}

interface IDataPlan extends Document {
  network: string;
  planSize: number;
  planType: string; // e.g., "SME", "Gifting", "SME2", "Data Share", "Corporate Gifting"
  planAmount: number;
  affiliatePrice: number;
  topUserPrice: number;
  planVolume: string; // e.g., "GB", "MB", "TB"
  smsCommand: string;
  smartEarnerPrice: number;
  apiPrice: number;
  apiDetails: IApiDetail[];
  simHostingDetails: ISimHostingDetail[];
  planDuration: string; // e.g., "30 days"
  available: boolean;
  vendingMethod: string; // API, SimHosting
}

interface IAirtimePlan extends Document {
  network: string;
  airtimeType: string;
  airtimeAmount: number;
  smartEarnerPercent: number;
  affiliatePercent: number;
  buyingPrice: number;
  topUserPercent: number;
  apiPercent: number;
  shareAndSellPercent: number;
  shareAndSellApiPercent: number;
  shareAndSellAffiliatePercent: number;
  shareAndSellTopUserPercent: number;
  available: boolean;
}

interface ICableSubscription extends Document {
  cableName: string;
  planAmount: number;
  productCode: string;
  package: string;
  available: boolean;
}

interface IBillPayment extends Document {
  billerType: string;
  billerName: string;
  billerId: string;
  available: boolean;
}

//SubSchemas
const ApiDetailSchema: Schema = new Schema(
  {
    apiName: { type: String },
    apiId: { type: String },
  },
  { _id: false }
);

const SimHostingDetailSchema: Schema = new Schema(
  {
    simHostingName: { type: String },
    simHostingIds: { type: String },
  },
  { _id: false }
);

// Schemas
const DataPlanSchema = new Schema<IDataPlan>({
  network: { type: String, required: true },
  planSize: { type: Number, required: true },
  planType: { type: String, required: true },

  planAmount: { type: Number, required: true },
  affiliatePrice: { type: Number, required: true },
  topUserPrice: { type: Number, required: true },
  planVolume: { type: String },
  smsCommand: { type: String },
  smartEarnerPrice: { type: Number },

  apiPrice: { type: Number },
  apiDetails: { type: [ApiDetailSchema] },
  simHostingDetails: { type: [SimHostingDetailSchema] },
  planDuration: { type: String },
  available: { type: Boolean },
  vendingMethod: { type: String, required: true },
});
export const DataPlan: Model<IDataPlan> =
  mongoose.models.DataPlan ||
  mongoose.model<IDataPlan>("DataPlan", DataPlanSchema);

const AirtimePlanSchema = new Schema<IAirtimePlan>({
  network: { type: String, required: true },
  airtimeType: { type: String, required: true },
  airtimeAmount: { type: Number },
  buyingPrice: { type: Number },
  smartEarnerPercent: { type: Number, required: true },
  affiliatePercent: { type: Number, required: true },
  topUserPercent: { type: Number, required: true },
  apiPercent: { type: Number, required: true },
  shareAndSellPercent: { type: Number, required: true },
  shareAndSellApiPercent: { type: Number, required: true },
  shareAndSellAffiliatePercent: { type: Number, required: true },
  shareAndSellTopUserPercent: { type: Number, required: true },
  available: { type: Boolean },
});
export const AirtimePlan: Model<IAirtimePlan> =
  mongoose.models.AirtimePlan ||
  mongoose.model<IAirtimePlan>("AirtimePlan", AirtimePlanSchema);

const CableSubscriptionSchema = new Schema<ICableSubscription>({
  cableName: { type: String, required: true },
  planAmount: { type: Number, required: true },
  productCode: { type: String, required: true },
  package: { type: String, required: true },
  available: { type: Boolean },
});
export const CableSubscription: Model<ICableSubscription> =
  mongoose.models.CableSubscription ||
  mongoose.model<ICableSubscription>(
    "CableSubscription",
    CableSubscriptionSchema
  );

const BillPaymentSchema = new Schema<IBillPayment>({
  billerName: { type: String, required: true },
  billerType: { type: String, required: true },
  billerId: { type: String, required: true },
  available: { type: Boolean },
});
export const BillPayment: Model<IBillPayment> =
  mongoose.models.BillPayment ||
  mongoose.model<IBillPayment>("BillPayment", BillPaymentSchema);
