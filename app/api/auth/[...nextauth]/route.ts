// import { handlers } from "@/auth"
// // export const { GET, POST } = handlers
// export { handlers as GET, handlers as POST };
import NextAuth from "next-auth";
import { authOptions } from "@/auth";

export const dynamic = "force-dynamic";
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };