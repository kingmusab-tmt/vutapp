import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ChangePassword: React.FC = () => {
  const [resetCode, setResetCode] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "success" });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [resetRequested, setResetRequested] = useState(false);

  // Request Reset Code
  const handleRequestResetCode = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/users/requestResetCode");
      setMessage({ text: response.data.message, type: "success" });
      setResetRequested(true);
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.error ? error.response.data.error : "Failed to request reset code";
      setMessage({ text: errorMessage, type: "error" });
    } finally {
      setLoading(false);
      setOpenSnackbar(true);
    }
  };

  // Handle PIN Update
  const handleUpdatePin = async () => {
    if (!resetCode) {
      setMessage({ text: "Please enter the reset code sent to your email", type: "error" });
      setOpenSnackbar(true);
      return;
    }

    if (!/^\d{5}$/.test(newPin)) {
      setMessage({ text: "PIN must be exactly 5 digits", type: "error" });
      setOpenSnackbar(true);
      return;
    }

    if (newPin !== confirmPin) {
      setMessage({ text: "Pins do not match", type: "error" });
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/users/resetTransactionPin", { resetCode, newPin });
      setMessage({ text: response.data.message, type: "success" });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.error ? error.response.data.error : "Failed to request reset code";
      setMessage({ text: errorMessage, type: "error" });
    } finally {
      setLoading(false);
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Reset Code"
            type="number"
            value={resetCode}
            onChange={(e) => setResetCode(e.target.value)}
            disabled={!resetRequested}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="New Transaction Pin"
            type={showPin ? "text" : "password"}
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            inputProps={{ maxLength: 5 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPin((prev) => !prev)}>
                    {showPin ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Confirm New Transaction Pin"
            type={showConfirmPin ? "text" : "password"}
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value)}
            inputProps={{ maxLength: 5 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPin((prev) => !prev)}>
                    {showConfirmPin ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      {/* Request Reset Code Button */}
      <Button
        variant="contained"
        color="secondary"
        sx={{ mt: 2, mr: 2 }}
        onClick={handleRequestResetCode}
        disabled={loading || resetRequested}
      >
        {loading ? <CircularProgress size={24} /> : "Request Reset Code"}
      </Button>

      {/* Update PIN Button */}
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={handleUpdatePin}
        disabled={loading || !resetRequested}
      >
        {loading ? <CircularProgress size={24} /> : "Update PIN"}
      </Button>

      {/* Snackbar for Notifications */}
      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={message.type as "success" | "error"}>
          {message.text}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChangePassword;
