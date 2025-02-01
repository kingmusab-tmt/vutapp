"use server";

import { getServerSession } from "next-auth";

export const getUserImage = async () => {
  const session = await getServerSession();
  if (session) {
    return session.user?.image;
  }
};
