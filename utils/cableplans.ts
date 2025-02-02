import axios from "axios";

type Variation = {
  variation_code: string;
  name: string;
  variation_amount: string;
  fixedPrice: string;
};

type ApiResponse = {
  response_description: string;
  content: {
    ServiceName: string;
    serviceID: string;
    varations: Variation[];
  };
};

export const cablePlans: Record<string, string[]> = {
  GOTV: [],
  DSTV: [],
  Startime: [],
  Showmax: [],
};

export const fetchCablePlans = async (serviceID: string) => {
  try {
    const response = await axios.get<ApiResponse>(
      `https://vtpass.com/api/service-variations?serviceID=${serviceID}`
    );

    if (response.data && response.data.content.varations) {
      cablePlans[serviceID.toUpperCase()] = response.data.content.varations.map(
        (plan) => plan.name
      );
      console.log(`Updated ${serviceID} plans:`, cablePlans);
    }
  } catch (error) {
    console.error(`Error fetching ${serviceID} plans:`, error);
  }
};
