"use server";

import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";

export const checkIsAuthenticated = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    return true;
  }
  return false;
};