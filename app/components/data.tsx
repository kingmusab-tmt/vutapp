import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import DataPage from "./datapage";

interface IApiDetail {
  apiName: string;
  apiIds: string[];
}

const Data = () => {
  interface IDataPlan {
    _id: string;
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

  const [savedPlans, setSavedPlans] = useState<IDataPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<IDataPlan | null>(null);
  const [isAddPlan, setIsAddPlan] = useState(false);
  const [apiDetails, setApiDetails] = useState<IApiDetail[]>([]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  const fetchPlans = async () => {
    try {
      const response = await axios.get("/api/data");
      setSavedPlans(response.data);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch plans");
      setSnackbar({
        open: true,
        message: "Failed to fetch plans",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchPlans();
  };

  const handleEdit = async (_id: string) => {
    try {
      const response = await axios.get(`/api/data?id=${_id}`);
      setSelectedPlan(response.data);

      const apiDetailsResponse = await axios.get(
        `/api/data?network=${response.data?.network}&planType=${response.data?.planType}`
      );
      setApiDetails(apiDetailsResponse.data);
      setIsAddPlan(false);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching plan:", error);
      setSnackbar({
        open: true,
        message: "Failed to Fetch Plan",
        severity: "error",
      });
    }
  };

  const handleDeletePlan = async (_id: string) => {
    try {
      await axios.delete(`/api/data?id=${_id}`);
      setSavedPlans((prev) =>
        prev.filter((IDataPlan) => IDataPlan._id !== _id)
      );
      setSnackbar({
        open: true,
        message: "Deleted Successfully",
        severity: "success",
      });
      fetchPlans();
    } catch (err) {
      console.error("Error deleting plan:", err);
      setSnackbar({
        open: true,
        message: "Failed to delete plan",
        severity: "error",
      });
    }
  };

  const handleAddPlan = () => {
    setSelectedPlan(null);
    setIsAddPlan(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
    setIsAddPlan(false);
    fetchPlans();
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    // <div className="p-2 shadow rounded-md container w-screen h-screen flex flex-col">
    <div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Typography variant="h4" gutterBottom>
        Data Plans
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddPlan}
            sx={{ marginBottom: 2 }}
          >
            Add New Plan
          </Button>

          <Box sx={{ marginTop: 2 }}>
            <Typography variant="h6" gutterBottom>
              Saved Plans
            </Typography>
            <TableContainer sx={{ maxHeight: "100vh", overflow: "auto" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Network</TableCell>
                    <TableCell>Plan Size</TableCell>
                    <TableCell>Plan Type</TableCell>
                    <TableCell>Vending Method</TableCell>
                    <TableCell>Smart Earner Price</TableCell>
                    <TableCell>Affiliate Price</TableCell>
                    <TableCell>Top User Price</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {savedPlans &&
                    savedPlans.map((plan, index) => (
                      <TableRow key={index}>
                        <TableCell>{plan.network}</TableCell>
                        <TableCell>{plan.planSize}</TableCell>
                        <TableCell>{plan.planType}</TableCell>
                        <TableCell>{plan.vendingMethod}</TableCell>
                        <TableCell>{plan.smartEarnerPrice}</TableCell>
                        <TableCell>{plan.affiliatePrice}</TableCell>
                        <TableCell>{plan.topUserPrice}</TableCell>
                        <TableCell>
                          {plan.planSize === 1 && (
                            <Button
                              color="primary"
                              onClick={() => handleEdit(plan._id)}
                            >
                              Edit
                            </Button>
                          )}
                          <Button
                            color="error"
                            onClick={() => handleDeletePlan(plan._id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      )}

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          <DataPage
            selectedPlan={selectedPlan ?? undefined}
            isAddPlan={isAddPlan}
            handleCloseModal={handleCloseModal}
            fetchPlans={fetchPlans}
            apiDetails={apiDetails}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default Data;
