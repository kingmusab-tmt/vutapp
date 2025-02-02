import axios from "axios";

const VTPASS_API_KEY = process.env.VTPASS_SANDBOX_API_KEY!;
const VTPASS_BASE_URL = process.env.VTPASS_BASE_URL!;
const VTPASS_EMAIL = process.env.VTPASS_EMAIL!;
const VTPASS_PASSWORD = process.env.VTPASS_PASSWORD!;

if (!VTPASS_API_KEY || !VTPASS_EMAIL || !VTPASS_PASSWORD) {
  throw new Error("Missing VTpass API credentials in environment variables");
}

export async function purchaseAirtime({
  request_id,
  serviceID,
  phone,
  amount,
}: {
  request_id: string;
  serviceID: string;
  phone: string;
  amount: number;
}) {
  return makeVTpassPayment({ request_id, serviceID, phone, amount });
}

export async function payTVSubscription({
  request_id,
  serviceID,
  smartcard_number,
  amount,
}: {
  request_id: string;
  serviceID: string;
  smartcard_number: string;
  amount: number;
}) {
  return makeVTpassPayment({ request_id, serviceID, smartcard_number, amount });
}

export async function payElectricityBill({
  request_id,
  serviceID,
  meter_number,
  amount,
}: {
  request_id: string;
  serviceID: string;
  meter_number: string;
  amount: number;
}) {
  return makeVTpassPayment({ request_id, serviceID, meter_number, amount });
}

export async function payEducationFee({
  request_id,
  serviceID,
  student_id,
  amount,
}: {
  request_id: string;
  serviceID: string;
  student_id: string;
  amount: number;
}) {
  return makeVTpassPayment({ request_id, serviceID, student_id, amount });
}

async function makeVTpassPayment(payload: Record<string, any>) {
  try {
    const response = await axios.post(`${VTPASS_BASE_URL}/pay`, payload, {
      headers: {
        "api-key": VTPASS_API_KEY,
        Authorization: `Basic ${Buffer.from(
          `${VTPASS_EMAIL}:${VTPASS_PASSWORD}`
        ).toString("base64")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    // Log detailed error response
    console.error(
      "VTpass Airtime Purchase Error:",
      error.response?.data || error.message
    );

    throw new Error(
      `VTpass API Error: ${
        error.response?.data?.response_description || "Unknown error occurred"
      }`
    );
  }
}
