// import { NextRequest, NextResponse } from "next/server";
// import {
//   generateRegistrationOptions,
//   verifyRegistrationResponse,
// } from "@simplewebauthn/server";
// import { getServerSession } from "next-auth";
// import dbConnect from "@/lib/connectdb";
// import { RegistrationResponseJSON } from "@simplewebauthn/types";
// import { getChallenge, saveChallenge, saveCredentials } from "@/lib/webauthn";
// import User from "@/models/user";
// import { authOptions } from "@/auth";

// const domain = process.env.AUTH_DOMAIN!;
// const origin = process.env.AUTH_URL!;
// const appName = process.env.APP_NAME!;

// /**
//  * Handles the WebAuthn pre-registration request (GET)
//  * Generates and returns registration options for the user.
//  */
// export async function GET(req: NextRequest) {
//   const session = await getServerSession(authOptions);
//   console.log("Session:", session);
//   const email = session?.user?.email;
//   const userId = session?.user?.id;
//   if (!email || !userId) {
//     return NextResponse.json(
//       { message: "Authentication is required" },
//       { status: 401 }
//     );
//   }

//   await dbConnect();
//   const user = await User.findOne({ email });
//   if (!user) {
//     return NextResponse.json({ message: "User not found" }, { status: 404 });
//   }

//   const options = await generateRegistrationOptions({
//     rpID: domain,
//     rpName: appName,
//     userID: new TextEncoder().encode(userId),
//     userName: email,
//     attestationType: "none",
//     authenticatorSelection: {
//       userVerification: "preferred",
//     },
//     excludeCredentials: user.webAuthCredentials.map(
//       (c: { credentialID: Buffer; transports: string[] }) => ({
//         id: c.credentialID,
//         type: "public-key",
//         transports: c.transports,
//       })
//     ),
//   });

//   try {
//     await saveChallenge({
//       userID: user._id.toString(),
//       challenge: options.challenge,
//     });
//   } catch (err) {
//     return NextResponse.json(
//       { message: "Could not set up challenge." },
//       { status: 500 }
//     );
//   }
//   return NextResponse.json(options, { status: 200 });
// }

// /**
//  * Handles the WebAuthn registration request (POST)
//  * Verifies and stores the user's public key.
//  */
// export async function POST(req: NextRequest) {
//   const session = await getServerSession(authOptions);
//   const email = session?.user?.email;
//   if (!email) {
//     return NextResponse.json(
//       { success: false, message: "You are not connected." },
//       { status: 401 }
//     );
//   }

//   await dbConnect();
//   const user = await User.findOne({ email });
//   if (!user) {
//     return NextResponse.json({ message: "User not found" }, { status: 404 });
//   }

//   const challenge = await getChallenge(user._id.toString());
//   if (!challenge) {
//     return NextResponse.json(
//       { success: false, message: "Pre-registration is required." },
//       { status: 401 }
//     );
//   }

//   const credential: RegistrationResponseJSON = await req.json();
//   const { verified, registrationInfo: info } = await verifyRegistrationResponse(
//     {
//       response: credential,
//       expectedRPID: domain,
//       expectedOrigin: origin,
//       expectedChallenge: challenge,
//     }
//   );

//   if (!verified || !info) {
//     return NextResponse.json(
//       { success: false, message: "Something went wrong" },
//       { status: 500 }
//     );
//   }

//   try {
//     await saveCredentials({
//       credentialID: credential.id,
//       transports: ["internal"],
//       userID: user._id.toString(),
//       key: Buffer.from(info.credentialPublicKey),
//       counter: info.counter ?? 0,
//     });
//     return NextResponse.json({ success: true }, { status: 201 });
//   } catch (err) {
//     return NextResponse.json(
//       { success: false, message: "Could not register the credential." },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/connectdb";
import { RegistrationResponseJSON } from "@simplewebauthn/types";
import { getChallenge, saveChallenge, saveCredentials } from "@/lib/webauthn";
import User from "@/models/user";
import { authOptions } from "@/auth";
import cbor from "cbor"; // Add this import for CBOR decoding

const domain = process.env.AUTH_DOMAIN!;
const origin = process.env.AUTH_URL!;
const appName = process.env.APP_NAME!;

/**
 * Handles the WebAuthn pre-registration request (GET)
 * Generates and returns registration options for the user.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  console.log("Session:", session);
  const email = session?.user?.email;
  const userId = session?.user?.id;

  if (!email || !userId) {
    return NextResponse.json(
      { message: "Authentication is required" },
      { status: 401 }
    );
  }

  await dbConnect();
  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const options = await generateRegistrationOptions({
    rpID: domain,
    rpName: appName,
    userID: new TextEncoder().encode(userId),
    userName: email,
    attestationType: "none",
    authenticatorSelection: {
      userVerification: "preferred",
    },
    excludeCredentials: user.webAuthCredentials.map(
      (c: { credentialID: Buffer; transports: string[] }) => ({
        id: c.credentialID,
        type: "public-key",
        transports: c.transports,
      })
    ),
  });

  try {
    await saveChallenge({
      userID: user._id.toString(),
      challenge: options.challenge,
    });
  } catch (err) {
    console.error("Error saving challenge:", err);
    return NextResponse.json(
      { message: "Could not set up challenge." },
      { status: 500 }
    );
  }

  return NextResponse.json(options, { status: 200 });
}

/**
 * Handles the WebAuthn registration request (POST)
 * Verifies and stores the user's public key.
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json(
      { success: false, message: "You are not connected." },
      { status: 401 }
    );
  }

  await dbConnect();
  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const challenge = await getChallenge(user._id.toString());

  if (!challenge) {
    return NextResponse.json(
      { success: false, message: "Pre-registration is required." },
      { status: 401 }
    );
  }

  const credential: RegistrationResponseJSON = await req.json();

  try {
    const { verified, registrationInfo } = await verifyRegistrationResponse({
      response: credential,
      expectedRPID: domain,
      expectedOrigin: origin,
      expectedChallenge: challenge,
    });

    if (!verified || !registrationInfo) {
      return NextResponse.json(
        { success: false, message: "Something went wrong" },
        { status: 500 }
      );
    }

    // Decode the attestationObject to extract the public key and counter
    const attestationObject = registrationInfo.attestationObject;
    const decodedAttestation = cbor.decode(attestationObject);

    // Extract the credentialPublicKey from the decoded attestation
    const credentialPublicKey = decodedAttestation.authData.slice(55); // Public key starts at byte 55
    const counter = decodedAttestation.authData.slice(33, 37).readUInt32BE(0); // Counter is bytes 33-36

    await saveCredentials({
      credentialID: credential.id,
      transports: ["internal"],
      userID: user._id.toString(),
      key: Buffer.from(credentialPublicKey),
      counter: counter,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Error during registration verification:", err);
    return NextResponse.json(
      { success: false, message: "Could not register the credential." },
      { status: 500 }
    );
  }
}
