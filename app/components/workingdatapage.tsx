import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";

interface IApiDetail {
  apiName: string;
  apiIds: string[];
}

interface ISimHostingDetail {
  simHostingName: string;
  simHostingIds: string[];
}

interface IDataPlan {
  network: string;
  planSize: number;
  planType: string;
  planAmount: number;
  affiliatePrice: number;
  topUserPrice: number;
  planVolume: string;
  smsCommand: string;
  smartEarnerPrice: number;
  apiPrice: number;
  apiDetails: IApiDetail[];
  simHostingDetails: ISimHostingDetail[];
  planDuration: string;
  available: boolean;
  vendingMethod: string;
}


const networks = ["MTN", "Airtel", "9mobile", "Glo"];
const planTypes = ["SME", "Gifting", "SME2", "Data Share", "Corporate Gifting"];
const planSizes = [500, 1000, 2000, 3000, 5000, 10000]; // in MB

const DataPage: React.FC = () => {
  const [currentNetwork, setCurrentNetwork] = useState(0);
  const [vendingMethod, setVendingMethod] = useState("API");
  const [selectedPlanType, setSelectedPlanType] = useState(planTypes[0]);

  const [formData, setFormData] = useState<IDataPlan[]>(
    planTypes.map(() => ({
      network: networks[currentNetwork],
      planSize: 0,
      planType: "",
      planAmount: 0,
      affiliatePrice: 0,
      topUserPrice: 0,
      planVolume: "GB",
      smsCommand: "",
      smartEarnerPrice: 0,
      apiPrice: 0,
      apiDetails: [],
      simHostingDetails: [],
      planDuration: "30 days",
      available: true,
      vendingMethod: "API",
    }))
  );
  const [savedPlans, setSavedPlans] = useState<IDataPlan[]>([]);

  const handleInputChange = (field: string, value: any) => {
    const updatedData = [...formData];
    (updatedData[currentNetwork] as any)[field] = value;
    setFormData(updatedData);
  };

  const handleAddApiDetail = () => {
    const updatedApiDetails = [
      ...formData[currentNetwork].apiDetails,
      { apiName: "", apiIds: Array(planSizes.length).fill("") },
    ];
    handleInputChange("apiDetails", updatedApiDetails);
  };

  const handleDeleteApiDetail = (index: number) => {
    const updatedApiDetails = formData[currentNetwork].apiDetails.filter((_, i) => i !== index);
    handleInputChange("apiDetails", updatedApiDetails);
  };

  const handleAddSimHostingDetail = () => {
    const updatedSimHostingDetails = [
      ...formData[currentNetwork].simHostingDetails,
      { simHostingName: "", simHostingIds: Array(planSizes.length).fill("") },
    ];
    handleInputChange("simHostingDetails", updatedSimHostingDetails);
  };

  const handleDeleteSimHostingDetail = (index: number) => {
    const updatedSimHostingDetails = formData[currentNetwork].simHostingDetails.filter((_, i) => i !== index);
    handleInputChange("simHostingDetails", updatedSimHostingDetails);
  };

    const handleEdit = async (index: number) => {
  try {
    const planToEdit = savedPlans[index];
    const response = await axios.get(`/api/data/${planToEdit.planSize}`); // Assuming `id` is a unique identifier
    const fetchedPlan = response.data;

    setCurrentNetwork(networks.indexOf(fetchedPlan.network));
    setVendingMethod(fetchedPlan.vendingMethod);
    setSelectedPlanType(fetchedPlan.planType);

    setFormData((prev) => {
      const updated = [...prev];
      updated[currentNetwork] = fetchedPlan;
      return updated;
    });
  } catch (error) {
    console.error("Error fetching plan details:", error);
    alert("Failed to fetch plan details. Please try again.");
  }
};
  
const handleDeletePlan = async (index: number) => {
  try {
    const planToDelete = savedPlans[index];
    await axios.delete(`/api/data/${planToDelete.planSize}`); // Assuming `id` is a unique identifier

    setSavedPlans((prev) => prev.filter((_, i) => i !== index));
    alert("Plan deleted successfully!");
  } catch (error) {
    console.error("Error deleting plan:", error);
    alert("Failed to delete plan. Please try again.");
  }
};
  const handleSave = async () => {
    const { smartEarnerPrice, affiliatePrice, topUserPrice, apiPrice } = formData[currentNetwork];

    const calculatedPlans: IDataPlan[] = planSizes.map((size, sizeIndex) => ({
      network: networks[currentNetwork],
      planSize: (size / 1000), 
      planType: selectedPlanType,
      vendingMethod,
      planAmount: apiPrice * (size / 1000),
      affiliatePrice: affiliatePrice * (size / 1000),
      topUserPrice: topUserPrice * (size / 1000),
      planVolume: "GB",
      smsCommand: "",
      smartEarnerPrice: smartEarnerPrice * (size / 1000),
      apiPrice: apiPrice * (size / 1000),
      apiDetails: formData[currentNetwork].apiDetails.map((detail) => ({
        apiName: detail.apiName, 
      apiId: detail.apiIds[sizeIndex], 
    apiIds: detail.apiIds, 
      })).filter((detail) => detail.apiId),
      simHostingDetails: formData[currentNetwork].simHostingDetails.map((detail) => ({
        simHostingName: detail.simHostingName, 
      simHostingId: detail.simHostingIds[sizeIndex],
    simHostingIds: detail.simHostingIds, 
      })).filter((detail) => detail.simHostingId),
      planDuration: "30 days",
      available: true,
    }));

    try {
      await axios.post("/api/data", { plans: calculatedPlans });
      alert("Plans saved successfully!");
    } catch (error) {
      console.error("Error saving plans:", error);
      alert("Failed to save plans. Please try again.");
    }
  };



  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Data Plans Management
      </Typography>

      {/* Top Section: Vending Method, Network, Plan Type, Prices */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, marginBottom: 2 }}>
        <FormControl sx={{ flex: "1 1 200px" }}>
          <InputLabel>Vending Method</InputLabel>
          <Select
            value={vendingMethod}
            onChange={(e) => setVendingMethod(e.target.value)}
          >
            <MenuItem value="API">API</MenuItem>
            <MenuItem value="SIMhosting">SIM Hosting</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ flex: "1 1 200px" }}>
          <InputLabel>Network</InputLabel>
          <Select
            value={networks[currentNetwork]}
            onChange={(e) => setCurrentNetwork(networks.indexOf(e.target.value))}
          >
            {networks.map((network) => (
              <MenuItem key={network} value={network}>
                {network}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ flex: "1 1 200px" }}>
          <InputLabel>Plan Type</InputLabel>
          <Select
            value={selectedPlanType}
            onChange={(e) => setSelectedPlanType(e.target.value)}
          >
            {planTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Smart Earner Price"
          type="number"
          value={formData[currentNetwork].smartEarnerPrice}
          onChange={(e) =>
            handleInputChange("smartEarnerPrice", Number(e.target.value))
          }
          sx={{ flex: "1 1 200px" }}
        />

        <TextField
          label="Affiliate Price"
          type="number"
          value={formData[currentNetwork].affiliatePrice}
          onChange={(e) =>
            handleInputChange("affiliatePrice", Number(e.target.value))
          }
          sx={{ flex: "1 1 200px" }}
        />

        <TextField
          label="Top User Price"
          type="number"
          value={formData[currentNetwork].topUserPrice}
          onChange={(e) =>
            handleInputChange("topUserPrice", Number(e.target.value))
          }
          sx={{ flex: "1 1 200px" }}
        />
      </Box>

      {/* Conditional Section Based on Vending Method */}
      {vendingMethod === "API" ? (
        <Box>
          <Typography variant="h6" gutterBottom>
            API Details
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>API Name</TableCell>
                  {planSizes.map((size) => (
                    <TableCell key={size}>{size} Plan ID</TableCell>
                  ))}
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData[currentNetwork].apiDetails.map((apiDetail, apiIndex) => (
                  <TableRow key={apiIndex}>
                    <TableCell>
                      <TextField
                        value={apiDetail.apiName || ""}
                        onChange={(e) => {
                          const updatedApiDetails = [...formData[currentNetwork].apiDetails];
                          updatedApiDetails[apiIndex].apiName = e.target.value;
                          handleInputChange("apiDetails", updatedApiDetails);
                        }}
                      />
                    </TableCell>
                    {planSizes.map((_, sizeIndex) => (
                      <TableCell key={sizeIndex}>
                        <TextField
                          value={apiDetail.apiIds[sizeIndex] || ""}
                          onChange={(e) => {
                            const updatedApiDetails = [...formData[currentNetwork].apiDetails];
                            updatedApiDetails[apiIndex].apiIds[sizeIndex] = e.target.value;
                            handleInputChange("apiDetails", updatedApiDetails);
                          }}
                        />
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button
                        color="error"
                        onClick={() => handleDeleteApiDetail(apiIndex)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ marginTop: 2, textAlign: "right" }}>
            <Button variant="contained" color="primary" onClick={handleAddApiDetail}>
              Add API ID
            </Button>
          </Box>
        </Box>
      ) : (
        <Box>
          <Typography variant="h6" gutterBottom>
            SIM Hosting Details
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>SIM Hosting Name</TableCell>
                  {planSizes.map((size) => (
                    <TableCell key={size}>{size} Plan ID</TableCell>
                  ))}
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData[currentNetwork].simHostingDetails.map((simHostingDetail, simHostingIndex) => (
                  <TableRow key={simHostingIndex}>
                    <TableCell>
                      <TextField
                        value={simHostingDetail.simHostingName || ""}
                        onChange={(e) => {
                          const updatedSimHostingDetails = [...formData[currentNetwork].simHostingDetails];
                          updatedSimHostingDetails[simHostingIndex].simHostingName = e.target.value;
                          handleInputChange("simHostingDetails", updatedSimHostingDetails);
                        }}
                      />
                    </TableCell>
                    {planSizes.map((_, sizeIndex) => (
                      <TableCell key={sizeIndex}>
                        <TextField
                          value={formData[currentNetwork].simHostingDetails[simHostingIndex]?.simHostingIds[sizeIndex] || ""}
                          onChange={(e) => {
                            const updatedSimHostingDetails = [...formData[currentNetwork].simHostingDetails];
                            updatedSimHostingDetails[simHostingIndex].simHostingIds[sizeIndex] = e.target.value;
                            handleInputChange("simHostingDetails", updatedSimHostingDetails);
                          }}
                        />
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button
                        color="error"
                        onClick={() => handleDeleteSimHostingDetail(simHostingIndex)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ marginTop: 2, textAlign: "right" }}>
            <Button variant="contained" color="primary" onClick={handleAddSimHostingDetail}>
              Add SIM Hosting
            </Button>
          </Box>
        </Box>
      )}

      {/* Save Button */}
      <Box sx={{ marginTop: 2, textAlign: "right" }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default DataPage;
