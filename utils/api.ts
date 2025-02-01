import axios from "axios";

const API_PROVIDERS: Record<string, { baseUrl: string; token: string }> = {
  BELLO_SME: {
    baseUrl: "https://bellodigitalworld.ng/api/v1/data",
    token: process.env.BELLO_SME!, // Replace with actual token
  },
  BELLO_CG: {
    baseUrl: "https://bellodigitalworld.ng/api/v1/data",
    token: process.env.BELLO_CG!, // Replace with actual token
  },
  BELLO_GENERAL: {
    baseUrl: "https://bellodigitalworld.ng/api/v1/data",
    token: process.env.BELLO_GENERAL!, // Replace with actual token
  },
};

export const buyData = async (
  provider: keyof typeof API_PROVIDERS,
  network_id: string,
  phone: string,
  plan_id: string
) => {
  console.log(`this is the provider ${provider}`);
  console.log(`this is the assigned Network Id ${network_id}`);
  console.log(`plan_id ${plan_id}`);
  const apiProvider = API_PROVIDERS[provider];

  try {
    const response = await axios.post(
      apiProvider.baseUrl,
      { network_id, phone, plan_id },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiProvider.token}`,
        },
      }
    );
    console.log(response);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error buying data:",
      error.response?.data || (error as Error).message
    );
  }
};
