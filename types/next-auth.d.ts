import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      role?: string | null;
      image: string | null;
      id: string | null;
    } & DefaultSession["user"];
  }
  interface Session {
    id: string | null;
    role: string | null;
    image: string | null;
  }

  interface User {
    id: string | null;
    role: string | null;
    image: string | null;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id: string | null;
    role: string | null;
    image: string | null;
  }
}
