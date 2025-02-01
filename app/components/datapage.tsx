import React, { useEffect, useState } from "react";
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
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

interface IApiDetail {
  apiName: string;
  apiIds: string[];
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
  planDuration: string;
  available: boolean;
  vendingMethod: string;
}

const networks = ["MTN", "Airtel", "9mobile", "Glo"];
const planTypes = ["SME", "Gifting", "SME2", "Data Share", "Corporate Gifting"];
const planSizes = [500, 1000, 2000, 3000, 5000, 10000]; // in MB

interface DataPageProps {
  isAddPlan: boolean;
  selectedPlan?: Partial<IDataPlan>;
  apiDetails?: IApiDetail[];
  handleCloseModal: () => void;
  fetchPlans: () => void;
}

const DataPage: React.FC<DataPageProps> = ({
  isAddPlan,
  selectedPlan,
  apiDetails,
  handleCloseModal,
  fetchPlans,
}) => {
  const [currentNetwork, setCurrentNetwork] = useState(0);
  const [vendingMethod, setVendingMethod] = useState("API");
  const [selectedPlanType, setSelectedPlanType] = useState(planTypes[0]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  const [formData, setFormData] = useState<IDataPlan>({
    network: networks[0],
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
    planDuration: "30 days",
    available: true,
    vendingMethod: "API",
  });

  useEffect(() => {
    if (!isAddPlan && selectedPlan) {
      // Populate fields when editing a plan
      setFormData({
        network: selectedPlan.network || networks[0],
        planSize: selectedPlan.planSize || 0,
        planType: selectedPlan.planType || planTypes[0],
        planAmount: selectedPlan.planAmount || 0,
        affiliatePrice: selectedPlan.affiliatePrice || 0,
        topUserPrice: selectedPlan.topUserPrice || 0,
        planVolume: "GB",
        smsCommand: "",
        smartEarnerPrice: selectedPlan.smartEarnerPrice || 0,
        apiPrice: selectedPlan.apiPrice || 0,
        apiDetails: apiDetails || [],
        planDuration: "30 days",
        available: true,
        vendingMethod: selectedPlan.vendingMethod || "API",
      });

      setCurrentNetwork(networks.indexOf(selectedPlan.network || networks[0]));
      setVendingMethod(selectedPlan.vendingMethod || "API");
      setSelectedPlanType(selectedPlan.planType || planTypes[0]);
    }
  }, [isAddPlan, selectedPlan, apiDetails]);

  const handleInputChange = (
    field: string,
    value: string | number | { apiName: string; apiIds: any[] }[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddApiDetail = () => {
    const updatedApiDetails = [
      ...formData.apiDetails,
      { apiName: "", apiIds: Array(planSizes.length).fill("") },
    ];
    handleInputChange("apiDetails", updatedApiDetails);
  };

  const handleDeleteApiDetail = (index: number) => {
    const updatedApiDetails = formData.apiDetails.filter((_, i) => i !== index);
    handleInputChange("apiDetails", updatedApiDetails);
  };

  const handleSave = async () => {
    const { smartEarnerPrice, affiliatePrice, topUserPrice, apiPrice } =
      formData;

    const calculatedPlans: IDataPlan[] = planSizes.map((size, sizeIndex) => ({
      network: networks[currentNetwork],
      planSize: size / 1000,
      planType: selectedPlanType,
      vendingMethod,
      planAmount: apiPrice * (size / 1000),
      affiliatePrice: affiliatePrice * (size / 1000),
      topUserPrice: topUserPrice * (size / 1000),
      planVolume: "GB",
      smsCommand: "",
      smartEarnerPrice: smartEarnerPrice * (size / 1000),
      apiPrice: apiPrice * (size / 1000),
      apiDetails: formData.apiDetails
        .map((detail) => ({
          apiName: detail.apiName,
          apiId: detail.apiIds[sizeIndex],
          apiIds: detail.apiIds,
        }))
        .filter((detail) => detail.apiId),
      planDuration: "30 days",
      available: true,
    }));

    try {
      if (isAddPlan) {
        const response = await axios.post("/api/data", {
          plans: calculatedPlans,
        });
        handleCloseModal();
        fetchPlans();
        if (response.status === 201) {
          setSnackbar({
            open: true,
            message: "Plan Added Successfully",
            severity: "success",
          });
        }
      } else {
        await axios.delete(
          `/api/data?network=${formData.network}&planType=${formData.planType}`
        );
        const response = await axios.post("/api/data", {
          plans: calculatedPlans,
        });
        if (response.status === 200) {
          setSnackbar({
            open: true,
            message: "Plans Updated Successfully",
            severity: "success",
          });
        }
      }
      handleCloseModal();
      fetchPlans();
    } catch (error) {
      console.error("Error saving plan:", error);
      setSnackbar({
        open: true,
        message: "Error saving plan.",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Typography variant="h4" gutterBottom>
        {isAddPlan ? "Create New Plan" : "Edit Plan"}
      </Typography>

      {/* Form fields */}
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
            value={formData.network}
            onChange={(e) => handleInputChange("network", e.target.value)}
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
          value={formData.smartEarnerPrice}
          onChange={(e) =>
            handleInputChange("smartEarnerPrice", Number(e.target.value))
          }
          sx={{ flex: "1 1 200px" }}
        />

        <TextField
          label="Affiliate Price"
          type="number"
          value={formData.affiliatePrice}
          onChange={(e) =>
            handleInputChange("affiliatePrice", Number(e.target.value))
          }
          sx={{ flex: "1 1 200px" }}
        />

        <TextField
          label="Top User Price"
          type="number"
          value={formData.topUserPrice}
          onChange={(e) =>
            handleInputChange("topUserPrice", Number(e.target.value))
          }
          sx={{ flex: "1 1 200px" }}
        />
      </Box>

      {/* API Details */}
      {vendingMethod === "API" && (
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
                {formData.apiDetails.map((apiDetail, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <TextField
                        value={apiDetail.apiName}
                        onChange={(e) => {
                          const updatedApiDetails = [...formData.apiDetails];
                          updatedApiDetails[index].apiName = e.target.value;
                          handleInputChange("apiDetails", updatedApiDetails);
                        }}
                      />
                    </TableCell>
                    {planSizes.map((_, sizeIndex) => (
                      <TableCell key={sizeIndex}>
                        <TextField
                          value={apiDetail.apiIds[sizeIndex] || ""}
                          onChange={(e) => {
                            const updatedApiDetails = [...formData.apiDetails];
                            updatedApiDetails[index].apiIds[sizeIndex] =
                              e.target.value;
                            handleInputChange("apiDetails", updatedApiDetails);
                          }}
                        />
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button
                        color="error"
                        onClick={() => handleDeleteApiDetail(index)}
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddApiDetail}
            >
              Add API Detail
            </Button>
          </Box>
        </Box>
      )}

      {/* Save Button */}
      <Box sx={{ marginTop: 2, textAlign: "right" }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          {isAddPlan ? "Save New Plan" : "Update Plan"}
        </Button>
      </Box>
    </Box>
  );
};

export default DataPage;
