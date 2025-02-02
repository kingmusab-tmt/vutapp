import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { toZonedTime } from "date-fns-tz";

export async function extractPlanDetails(planString: string) {
  const match = planString.match(/(\d+GB)\s+N(\d+)/);
  if (match) {
    return { plansize: match[1], amount: parseFloat(match[2]) };
  }

  return { plansize: null, amount: 0 };
}

export async function generateReferenceId(): Promise<string> {
  return "TXN-" + Math.random().toString(36).slice(2, 12).toUpperCase();
}

export async function generateRequestId(): Promise<string> {
  const timeZone = "Africa/Lagos";
  const now = toZonedTime(new Date(), timeZone);
  const timestamp = format(now, "yyyyMMddHHmm");
  const uniqueId = uuidv4().replace(/-/g, "").slice(0, 8);
  return `${timestamp}${uniqueId}`;
}
