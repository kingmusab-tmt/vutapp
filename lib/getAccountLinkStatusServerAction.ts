"use server";

import { getServerSession } from "next-auth";
import client from "./db";
import dbConnect from "./connectdb";
import User from "@/models/user";

export const getAccountLinkStatus = async () => {
  // Check if the user is authenticated
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const email: string = session.user?.email ?? "";
  if (!email) {
    throw new Error("email is null");
  }

  // Sanitize input
  const uuidRegExp: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (typeof email !== "string" || !uuidRegExp.test(email)) {
    throw new Error("Invalid UUID");
  }

  // Check if the user has a Google account linked in MongoDB
  try {
    await dbConnect();

    const accountExists = await User.findOne({
      provider: "email",
      email,
    });

    // If no matching account is found, return false
    if (!accountExists) {
      return false;
    }
  } catch (error) {
    console.error("Failed to check if user has Google account linked:", error);
    throw new Error("Database query failed");
  }

  return true;
};
