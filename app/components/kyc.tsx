"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Grid,
  Container,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  nin: yup
    .string()
    .required("NIN is required")
    .length(11, "NIN must be 11 digits"),
  bvn: yup
    .string()
    .required("BVN is required")
    .length(11, "BVN must be 11 digits"),
});

interface KycFormProps {
  handleCloseModal: () => void;
}

const KycForm: React.FC<KycFormProps> = ({ handleCloseModal }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nin: "",
      bvn: "",
    },
  });

  const ninValue = watch("nin");

  const handleNinVerification = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/verifynin", { nin: ninValue });
      if (response.data.requestSuccessful) {
        setVerified(true);
        setSnackbarMessage("Information Verified");
        setSnackbarSeverity("success");
      } else {
        setVerified(false);
        setSnackbarMessage("Invalid NIN or BVN");
        setSnackbarSeverity("error");
      }
    } catch (error) {
      console.error("Error verifying NIN:", error);
      setSnackbarMessage("Error verifying NIN. Please try again later.");
      setSnackbarSeverity("error");
    } finally {
      setLoading(false);
      setOpenSnackbar(true);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      await axios.put("/api/users/updateuser", data);
      setSnackbarMessage("KYC details updated successfully!");
      setSnackbarSeverity("success");
      handleCloseModal();
    } catch (error) {
      console.error("Error updating KYC details:", error);
      setSnackbarMessage("Failed to update KYC details.");
      setSnackbarSeverity("error");
    } finally {
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Welcome, {session?.user?.name || "User"}! Please Complete your KYC
          <Typography variant="h6">
            The below information is reguired because of Central Bank of Nigeria
            (CBN) directives by requiring users to provide their Bank
            Verification Number (BVN) or National Identification Number (NIN)
            before creating new virtual accounts.{" "}
          </Typography>
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="nin"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="NIN Number"
                    error={!!errors.nin}
                    helperText={errors.nin?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="bvn"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="BVN Number"
                    error={!!errors.bvn}
                    helperText={errors.bvn?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={
                  verified ? handleSubmit(onSubmit) : handleNinVerification
                }
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : verified ? (
                  "Submit KYC"
                ) : (
                  "Verify NIN"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default KycForm;
