// import CredentialsProvider from 'next-auth/providers/credentials';
// import { verifyAuthenticationResponse } from '@simplewebauthn/server';
// import base64url from 'base64url';
// import Google from "next-auth/providers/google";
// import EmailProvider from "next-auth/providers/email";
// import client from "./lib/db";
// import { MongoDBAdapter } from "@auth/mongodb-adapter";
// import { clearStaleTokens } from "./lib/clearStaleTokensServerAction";
// import { NextAuthOptions} from "next-auth";
// import dbConnect from "./lib/connectdb";
// import User from "./models/user";
// import { createTransport } from "nodemailer";

// const domain = process.env.AUTH_URL!;
// const origin = process.env.AUTH_URL!;

// export const authOptions = {
//   adapter: MongoDBAdapter(client),
//   secret: process.env.AUTH_SECRET as string,

//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60,
//   },
//   pages: {
//     signIn: "/auth/sign-in",
//     verifyRequest: "/auth/auth-success",
//     error: "/auth/auth-error",
//   },
//   providers: [
//     Google({
//       clientId: process.env.AUTH_GOOGLE_ID as string,
//       clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
//       allowDangerousEmailAccountLinking: true,
//        authorization: {
//         params: {
//           prompt: "select_account",
//           access_type: "offline",
//           response_type: "code",
//         },
//       },
//        async profile(profile) {
//         return {
//           id: profile.sub,
//           username: profile.sub,
//           email: profile.email,
//           emailVerified: profile.email_verified,
//           name: profile.name,
//           image: profile.picture,
//           role: profile.role ?? "user",
//           provider: profile.provider ?? "google",
//           lastLogin: null,
//           hasSeenModal: false,
//         };
//       },
//       httpOptions: {
//         timeout: 10000,
//       },
//     }),
//     EmailProvider({
//       server: {
//         host: process.env.EMAIL_SERVER_HOST as string,
//         port: parseInt(process.env.EMAIL_SERVER_PORT as string, 10),
//         auth: {
//           user: process.env.EMAIL_SERVER_USER as string,
//           pass: process.env.EMAIL_SERVER_PASSWORD as string,
//         },
//       },
//       from: process.env.EMAIL_FROM as string,
//       sendVerificationRequest: async ({ identifier, url, provider }) => {
//     const { host } = new URL(url);
//     const transport = createTransport(provider.server);
//     await transport.sendMail({
//       to: identifier,
//       from: provider.from,
//       subject: `Sign in to ${host}`,
//       text: `Sign in by clicking on the link below:\n\n${url}\n\n`,
//       html: `<p>Sign in by clicking on the link below:</p><p><a href="${url}">Sign in</a></p>`,
//     });
//   },
//     }),
//     CredentialsProvider({
//     name: 'webauthn',
//     credentials: {},
//     async authorize(_, req) {
//         const { id, response } = req.body ?? {};

//         if (!id || !response) {
//             return null;
//         }

//         await dbConnect();
//         const user = await User.findOne({ 'webAuthCredentials.credentialID': id });
//         if (!user) {
//             return null;
//         }

//         const credential = user.webAuthCredentials.find((cred: { credentialID: string }) => cred.credentialID === id);
//         if (!credential) {
//             return null;
//         }

//         const challenge = user.webAuthChallenge;
//         if (!challenge) {
//             return null;
//         }

//         try {
//             const verification = await verifyAuthenticationResponse({
//                 response,
//                 expectedChallenge: challenge,
//                 expectedOrigin: origin,
//                 expectedRPID: domain,
//                 authenticator: {
//                     credentialPublicKey: credential.credentialPublicKey,
//                     credentialID: base64url.toBuffer(credential.credentialID),
//                     counter: credential.counter,
//                 },
//             });

//             if (!verification.verified || !verification.authenticationInfo) {
//                 return null;
//             }

//             credential.counter = verification.authenticationInfo.newCounter;
//             user.webAuthChallenge = null;
//             await user.save();

//         } catch (err) {
//             console.error(err);
//             return null;
//         }

//         return {
//             id: user.id,
//             email: user.email,
//             name: user.name,
//             image: user.image,
//             role: user.role,
//             provider: user.provider,
//             lastLogin: user.lastLogin,
//             hasSeenModal: user.hasSeenModal,
//         };
//     }
// })
//   ],
//   callbacks: {
//     async redirect({ url, baseUrl }) {
//       return baseUrl + "/dashboard";
//     },
//     async jwt({ token, trigger, session, user }) {
//       if (user) {
//         token.email = user.email;
//         token.name = user.name;
//         token.id = user.id;
//         token.image = user.image;
//         token.role = user.role;
//         token.hasSeenModal = user.hasSeenModal;
//         token.lastLogin = user.lastLogin;
//         await clearStaleTokens();
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       await dbConnect();
//       const user = await User.findOne({ email: session?.user?.email });

//       if (user) {
//         user.lastLogin = new Date();
//         await user.save();
//         session.user = { ...session.user, ...user.toObject() };
//       } else {
//         session.user = { hasSeenModal: token.hasSeenModal, email: token.email, name: token.name, id: token.id, image: token.image, role: token.role, lastLogin: token.lastLogin, provider: token.provider };
//       }
//       return session;
//     },
//   },
//   debug: true,
// } as NextAuthOptions;
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import base64url from "base64url";
import Google from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import client from "./lib/db";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { clearStaleTokens } from "./lib/clearStaleTokensServerAction";
import { NextAuthOptions } from "next-auth";
import dbConnect from "./lib/connectdb";
import User from "./models/user";
import { createTransport } from "nodemailer";

const domain = process.env.AUTH_URL!;
const origin = process.env.AUTH_URL!;

export const authOptions = {
  adapter: MongoDBAdapter(client),
  secret: process.env.AUTH_SECRET as string,

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth/sign-in",
    verifyRequest: "/auth/auth-success",
    error: "/auth/auth-error",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
      async profile(profile) {
        return {
          id: profile.sub,
          username: profile.sub,
          email: profile.email,
          emailVerified: profile.email_verified,
          name: profile.name,
          image: profile.picture,
          role: profile.role ?? "user",
          provider: profile.provider ?? "google",
          lastLogin: null,
          hasSeenModal: false,
        };
      },
      httpOptions: {
        timeout: 10000,
      },
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST as string,
        port: parseInt(process.env.EMAIL_SERVER_PORT as string, 10),
        auth: {
          user: process.env.EMAIL_SERVER_USER as string,
          pass: process.env.EMAIL_SERVER_PASSWORD as string,
        },
      },
      from: process.env.EMAIL_FROM as string,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const { host } = new URL(url);
        const transport = createTransport(provider.server);
        await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `Sign in to ${host}`,
          text: `Sign in by clicking on the link below:\n\n${url}\n\n`,
          html: `<p>Sign in by clicking on the link below:</p><p><a href="${url}">Sign in</a></p>`,
        });
      },
    }),
    CredentialsProvider({
      name: "webauthn",
      credentials: {},
      async authorize(_, req) {
        const { id, response } = req.body ?? {};

        if (!id || !response) {
          return null;
        }

        await dbConnect();
        const user = await User.findOne({
          "webAuthCredentials.credentialID": id,
        });
        if (!user) {
          return null;
        }

        const credential = user.webAuthCredentials.find(
          (cred: { credentialID: string }) => cred.credentialID === id
        );
        if (!credential) {
          return null;
        }

        const challenge = user.webAuthChallenge;
        if (!challenge) {
          return null;
        }

        try {
          const verification = await verifyAuthenticationResponse({
            response,
            expectedChallenge: challenge,
            expectedOrigin: origin,
            expectedRPID: domain,
            credential: {
              id: credential.credentialID, // Expecting a string
              publicKey: base64url.toBuffer(credential.credentialPublicKey), // Expecting a Buffer
              counter: credential.counter, // Expecting a number
            },
          });

          if (!verification.verified || !verification.authenticationInfo) {
            return null;
          }

          // Extract authenticator data
          const { newCounter } = verification.authenticationInfo;

          credential.counter = newCounter;
          user.webAuthChallenge = null;
          await user.save();
        } catch (err) {
          console.error(err);
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          provider: user.provider,
          lastLogin: user.lastLogin,
          hasSeenModal: user.hasSeenModal,
        };
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl + "/dashboard";
    },
    async jwt({ token, trigger, session, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.id = user.id;
        token.image = user.image;
        token.role = user.role;
        token.hasSeenModal = user.hasSeenModal;
        token.lastLogin = user.lastLogin;
        await clearStaleTokens();
      }
      return token;
    },
    async session({ session, token }) {
      await dbConnect();
      const user = await User.findOne({ email: session?.user?.email });

      if (user) {
        user.lastLogin = new Date();
        await user.save();
        session.user = { ...session.user, ...user.toObject() };
      } else {
        session.user = {
          hasSeenModal: token.hasSeenModal,
          email: token.email,
          name: token.name,
          id: token.id,
          image: token.image,
          role: token.role,
          lastLogin: token.lastLogin,
          provider: token.provider,
        };
      }
      return session;
    },
  },
  debug: true,
} as NextAuthOptions;
