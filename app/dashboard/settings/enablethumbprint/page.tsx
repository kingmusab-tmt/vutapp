"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Switch, Modal, Snackbar, Alert } from "@mui/material";
import { registerWebauthn } from "@/utils/registerauth";
import SetupTransactionPin from "@/app/components/settransactionpin";

const EnableThumbprint: React.FC = () => {
  const [thumbprintEnabled, setThumbprintEnabled] = useState<boolean>(false);
  const [transactionPinEnabled, setTransactionPinEnabled] =
    useState<boolean>(false);
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get("/api/thumbandtransactionstatus");
        setThumbprintEnabled(response.data.thumbprintStatus ?? false);
        setTransactionPinEnabled(response.data.transactionStatus ?? false);
      } catch (error) {
        console.error("Error fetching authentication status", error);
        setThumbprintEnabled(false);
        setTransactionPinEnabled(false);
      }
    };
    fetchStatus();
  }, []);

  const handleThumbprintToggle = async () => {
    try {
      if (!thumbprintEnabled) await registerWebauthn();
      const newStatus = !thumbprintEnabled;
      await axios.post("/api/thumbandtransactionstatus", {
        thumbprintStatus: newStatus,
      });
      setThumbprintEnabled(newStatus);
      setSnackbarMessage("Thumbprint authentication updated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating thumbprint status", error);
      setSnackbarMessage("Failed to update thumbprint authentication");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleTransactionPinToggle = async () => {
    try {
      if (!transactionPinEnabled) {
        setShowPinModal(true);
      } else {
        const newStatus = !transactionPinEnabled;
        await axios.post("/api/thumbandtransactionstatus", {
          transactionStatus: newStatus,
        });
        setTransactionPinEnabled(newStatus);
        setSnackbarMessage("Transaction PIN disabled successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error updating transaction PIN status", error);
      setSnackbarMessage("Failed to update transaction PIN");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseModal = () => {
    setShowPinModal(false);
    setTransactionPinEnabled(true);
    setSnackbarMessage("Transaction PIN set successfully");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Enable Thumbprint
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography>Enable Thumbprint Authentication</Typography>
        <Switch
          checked={thumbprintEnabled}
          onChange={handleThumbprintToggle}
          color="primary"
          sx={{ ml: 2 }}
        />
      </Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Enable Transaction Pin
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography>Enable Transaction Pin</Typography>
        <Switch
          checked={transactionPinEnabled}
          onChange={handleTransactionPinToggle}
          color="primary"
          sx={{ ml: 2 }}
        />
      </Box>

      {/* Modal for Setting Transaction PIN */}
      <Modal open={showPinModal} onClose={() => setShowPinModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <SetupTransactionPin handleCloseModal={handleCloseModal} />
        </Box>
      </Modal>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EnableThumbprint;
