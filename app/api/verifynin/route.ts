// import { NextRequest, NextResponse } from "next/server";
// import { verifyNIN } from "@/utils/monnify";

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { nin } = body;

//     if (!nin) {
//       return NextResponse.json({ error: "NIN is required" }, { status: 400 });
//     }

//     const result = await verifyNIN(nin);
//     return NextResponse.json(result, { status: 200 });
//   } catch (error) {
//     console.log(error)
//     return NextResponse.json({ error: error?.message }, { status: 500 });
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { verifyNIN } from "@/utils/monnify";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nin } = body;

    if (!nin) {
      return NextResponse.json({ error: "NIN is required" }, { status: 400 });
    }

    const result = await verifyNIN(nin);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error verifying NIN:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details:
          error instanceof Error ? error.message : "An unknown error occurred",
        stack: error instanceof Error ? error.stack : null,
      },
      { status: 500 }
    );
  }
}
