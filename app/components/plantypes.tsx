import React, { useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Switch, Typography, Paper, Snackbar, Alert } from "@mui/material";

interface ServiceAvailabilityProps {
  network?: string;
  planType?: string;
  airtimeType?: string;
  cableType?: string;
  billType?: string;
  available: boolean;
  onToggle: (updatedAvailable: boolean) => void;
}

const ServiceAvailability: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });
  const [services, setServices] = useState({
        data: [
      { network: "MTN", planType: "SME", available: true },
      { network: "MTN", planType: "SME2", available: true },
      { network: "MTN", planType: "Gifting", available: true },
      { network: "MTN", planType: "Corporate Gifting", available: true },
      { network: "MTN", planType: "Data Share", available: true },
      { network: "AIRTEL", planType: "SME", available: true },
      { network: "AIRTEL", planType: "SME2", available: true },
      { network: "AIRTEL", planType: "Gifting", available: true },
      { network: "AIRTEL", planType: "Corporate Gifting", available: true },
      { network: "AIRTEL", planType: "Data Share", available: true },
      { network: "9MOBILE", planType: "SME", available: true },
      { network: "9MOBILE", planType: "SME2", available: true },
      { network: "9MOBILE", planType: "Gifting", available: true },
      { network: "9MOBILE", planType: "Corporate Gifting", available: true },
      { network: "9MOBILE", planType: "Data Share", available: true },
      { network: "GLO", planType: "SME", available: true },
      { network: "GLO", planType: "SME2", available: true },
      { network: "GLO", planType: "Gifting", available: true },
      { network: "GLO", planType: "Corporate Gifting", available: true },
      { network: "GLO", planType: "Data Share", available: true },
      
    ],
    airtime: [
      { network: "MTN", airtimeType: "VTU", available: true },
      { network: "MTN", airtimeType: "ShareAndSell", available: true },
      { network: "9mobile", airtimeType: "VTU", available: true },
      { network: "9mobile", airtimeType: "ShareAndSell", available: true },
      { network: "AIRTEL", airtimeType: "VTU", available: true },
      { network: "AIRTEL", airtimeType: "ShareAndSell", available: true },
      { network: "GLO", airtimeType: "VTU", available: true },
      { network: "GLO", airtimeType: "ShareAndSell", available: true },
    ],
    cable: [
      { cableType: "DSTV", available: true },
      { cableType: "GOTV", available: true },
      { cableType: "SMARTTIME", available: true },
    ],
    bill: [
      { billType: "Electricity", available: true },
      { billType: "Water", available: true },
    ],
  });

  const toggleAvailability = async (
    type: "data" | "airtime" | "cable" | "bill",
    params: ServiceAvailabilityProps
  ) => {
    setLoading(true);
    try {
      let endpoint = "";
      let payload = {};

      switch (type) {
        case "data":
          endpoint = "/api/data";
          payload = {
            network: params.network,
            planType: params.planType,
            available: !params.available,
          };
          break;
        case "airtime":
          endpoint = "/api/airtime";
          payload = {
            network: params.network,
            airtimeType: params.airtimeType,
            available: !params.available,
          };
          break;
        case "cable":
          endpoint = "/api/cableplans";
          payload = {
            cableType: params.cableType,
            available: !params.available,
          };
          break;
        case "bill":
          endpoint = "/api/billpayment";
          payload = {
            billType: params.billType,
            available: !params.available,
          };
          break;
        default:
          throw new Error("Invalid type");
      }

      const response = await axios.put(endpoint, payload);

      if (response.status === 200) {
        // Update the services state based on the type and the new availability
        setServices((prevServices) => ({
          ...prevServices,
          [type]: prevServices[type].map((service) =>
            // Match the service and update the `available` status
            (type === "data" && "planType" in service && service.planType === params.planType && service.network === params.network) ||
            (type === "airtime" && "airtimeType" in service && service.airtimeType === params.airtimeType && service.network === params.network) ||
            (type === "cable" && "cableType" in service && service.cableType === params.cableType) ||
            (type === "bill" && "billType" in service && service.billType === params.billType)
              ? { ...service, available: !params.available }
              : service
          ),
        }));
        setSnackbar({
          open: true,
          message: "Availability updated successfully!",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error updating availability", error);
      setSnackbar({
        open: true,
        message: "Failed to update availability.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div style={{ padding: "16px" }}>
       {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
      {/* Render tables for data, airtime, cable, and bills */}
      {Object.entries(services).map(([key, items]) => (
        <div key={key} style={{ marginTop: "16px" }}>
          <Typography variant="h6" gutterBottom>
            {key.charAt(0).toUpperCase() + key.slice(1)} Plans
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {key === "data" && (
                    <>
                      <TableCell>Network</TableCell>
                      <TableCell>Plan Type</TableCell>
                    </>
                  )}
                  {key === "airtime" && (
                    <>
                      <TableCell>Network</TableCell>
                      <TableCell>Airtime Type</TableCell>
                    </>
                  )}
                  {key === "cable" && <TableCell>Cable Type</TableCell>}
                  {key === "bill" && <TableCell>Biller Type</TableCell>}
                  <TableCell align="center">Available</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((service: any, index: number) => (
                  <TableRow key={index}>
                    {key === "data" && (
                      <>
                        <TableCell>{service.network}</TableCell>
                        <TableCell>{service.planType}</TableCell>
                      </>
                    )}
                    {key === "airtime" && (
                      <>
                        <TableCell>{service.network}</TableCell>
                        <TableCell>{service.airtimeType}</TableCell>
                      </>
                    )}
                    {key === "cable" && <TableCell>{service.cableType}</TableCell>}
                    {key === "bill" && <TableCell>{service.billType}</TableCell>}
                    <TableCell align="center">
                      <Switch
                        checked={service.available}
                        onChange={() =>
                          toggleAvailability(key as "data" | "airtime" | "cable" | "bill", {
                            ...service,
                            available: service.available,
                            onToggle: () => {},
                          })
                        }
                        color="primary"
                        disabled={loading}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ))}
    </div>
  );
};

export default ServiceAvailability;
