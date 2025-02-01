import axios from "axios";

const API_KEY = process.env.MONNIFY_API_KEY!;
const SECRET_KEY = process.env.MONNIFY_SECRET_KEY!;

export const getMonnifyToken = async () => {
  const authString = Buffer.from(`${API_KEY}:${SECRET_KEY}`).toString("base64");
  const response = await axios.post(
    "https://api.monnify.com/api/v1/auth/login",
    {},
    {
      headers: {
        Authorization: `Basic ${authString}`,
      },
    }
  );
  return response.data.responseBody.accessToken;
};

export const verifyNIN = async (nin: string) => {
  const accessToken = await getMonnifyToken();
  const response = await axios.post(
    "https://api.monnify.com/api/v1/vas/nin-details",
    { nin },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
