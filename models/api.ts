import mongoose, { Schema, Document, model } from "mongoose";

// Interfaces
export interface IAPIConfig {
  name: string; // Name of the API
  baseURL: string; // Base URL of the API
  authType: "username_password" | "api_key_secret" | "public"; // Type of authentication
  username?: string; // Username for APIs requiring username and password
  apiPrice: number;
  password?: string; // Password for APIs requiring username and password
  apiKey?: string; // API key for APIs requiring key-based authentication
  secretKey?: string; // Secret key for APIs requiring key-based authentication
  publicKey?: string; // Public key for APIs requiring only public access
  additionalHeaders?: Record<string, string>; // Any additional headers required
  description?: string; // Optional description of the API
  isActive: boolean; // Whether the API is active or not
}

export interface IAPIConfigModel extends Document, IAPIConfig {}

// Schema
const apiConfigSchema = new Schema<IAPIConfigModel>(
  {
    name: { type: String, required: true },
    baseURL: { type: String, required: true },
    authType: {
      type: String,
      enum: ["username_password", "api_key_secret", "public"],
      required: true,
    },
    username: { type: String },
    password: { type: String },
    apiKey: { type: String },
    apiPrice: { type: Number},
    secretKey: { type: String },
    publicKey: { type: String },
    additionalHeaders: { type: Map, of: String },
    description: { type: String },
    isActive: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Create the model if it doesn't already exist
const APIConfig = mongoose.models.APIConfig || model<IAPIConfigModel>("APIConfig", apiConfigSchema);

export default APIConfig;