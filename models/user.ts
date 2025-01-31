import mongoose, { Schema, Document, model } from "mongoose";
import bcrypt from "bcrypt";

interface IReserverAccountDetails extends Document {
  accountName: string;
  accountReferences: string;
  reservationReference: string;
  accounts: {
    bankCode: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
  }[];
}

export interface WebAuthCredential {
  credentialID: string;
  userID: string;
  transports: AuthenticatorTransport[];
  credentialPublicKey: Buffer;
  counter: number;
}

export interface IUser extends Document {
  username: string;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: "admin" | "user";
  userType: "Smart Earner" | "TopUser" | "API User" | "Affiliate User";
  mobileNumber: string;
  accountBalance: number;
  reserverAccountDetails: IReserverAccountDetails[];
  dateOfBirth: Date;
  bvn: string;
  nin: string;
  image: string;
  transactionPin: string;
  refererUsername: string | null;
  referals: mongoose.Types.ObjectId[];
  refererBonus: number;
  thumbprintStatus: boolean;
  transactionStatus: boolean;
  lastLogin: Date | null;
  webhookUrl: string;
  dateJoined: Date;
  webAuthCredentials: WebAuthCredential[];
  webAuthChallenge?: string; // Added for challenge storage
  hasSeenModal: boolean
  hasTransactionPin: boolean
  transactionPinResetCode: number;
  transactionPinResetExpires: Date;
  failedResetAttempts: number
}

const reserverAccountDetailsSchema = new Schema<IReserverAccountDetails>({
  accountName: { type: String, default: "" },
  accountReferences: { type: String, default: "" },
  reservationReference: { type: String, default: "" },
  accounts: [
    {
      bankCode: { type: String, default: "" },
      bankName: { type: String, default: "" },
      accountNumber: { type: String, default: "" },
      accountName: { type: String, default: "" },
    },
  ],
});

const webAuthCredentialSchema = new Schema<WebAuthCredential>({
  credentialID: { type: String, required: true },
  userID: { type: String},
  transports: { type: [String], required: true },
  credentialPublicKey: { type: Buffer, required: true },
  counter: { type: Number, required: true },
});

const userSchema = new Schema<IUser>(
  {
    username: { type: String, unique: true },
    firstName: { type: String},
    middleName: { type: String},
    lastName: { type: String },
    fullName: { type: String},
    email: { type: String, unique: true },
    role: { type: String, enum: ["admin", "user"] },
    userType: {
      type: String,
      enum: ["Smart Earner", "TopUser", "API User", "Affiliate User"],
    },
    mobileNumber: { type: String },
    accountBalance: { type: Number, default: 0 },
    reserverAccountDetails: { type: [reserverAccountDetailsSchema] },
    bvn: { type: String },
    nin: { type: String },
    image: { type: String, default: "" },
    dateOfBirth: { type: Date },
    transactionPin: { type: String },
    refererUsername: { type: String, default: null },
    referals: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    refererBonus: { type: Number, default: 0 },
    thumbprintStatus: { type: Boolean, default: false },
    transactionStatus: {type: Boolean, default: false},
    lastLogin: { type: Date, default: null },
    dateJoined: { type: Date, default: Date.now },
    webhookUrl: {type: String},
    webAuthCredentials: { type: [webAuthCredentialSchema], default: [] },
    webAuthChallenge: { type: String, default: null }, // Added challenge storage
    hasSeenModal: { type: Boolean, default: false },
    hasTransactionPin: { type: Boolean, default: false },
    transactionPinResetCode: { type: Number },
    transactionPinResetExpires: { type: Date },
    failedResetAttempts: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("transactionPin")) {
    const salt = await bcrypt.genSalt(10);
    this.transactionPin = await bcrypt.hash(this.transactionPin, salt);
  }
  next();
});

const User = mongoose.models.User || model<IUser>("User", userSchema);

export default User;
