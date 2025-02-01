"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  IconButton,
  Tabs,
  Tab,
  Switch,
  Grid,
  CircularProgress,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import EnableThumbprint from "./enablethumbprint/page";
import ChangePassword from "./changetransactionpin/page";
import StockVending from "./stockvending/page";
import { IUser } from "@/models/user";
// import KycForm from "@/app/components/kyc";
// import SetupTransactionPin from "@/app/components/settransactionpin";

const AccountSettings = () => {
  const [tabValue, setTabValue] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("/api/users/getSingleUser");
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDarkModeToggle = () => {
    setDarkMode((prev) => !prev);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser((prevUser) =>
      prevUser ? ({ ...prevUser, [name]: value } as IUser) : null
    );
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put("/api/users/updateuser", user);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile", error);
      alert("Failed to update profile");
    }
  };

  return (
    <Box
      sx={{
        width: "89vw",
        maxWidth: 800,
        mx: "auto",
        p: 3,
        bgcolor: darkMode ? "#333" : "#fff",
        color: darkMode ? "#fff" : "#000",
        borderRadius: 2,
        boxShadow: 3,
        overflowX: "hidden",
      }}
    >
      <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
        Account
      </Typography>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="General" />
        <Tab label="Change Transaction PIN" />
        <Tab label="Thumbprint" />
        <Tab label="Stock Vending" />
        <Tab label="KYC FORM" />
        <Tab label="Transaction Pin" />
      </Tabs>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={200}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {tabValue === 0 && (
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      sx={{ width: 80, height: 80, mb: 2 }}
                      src={user?.image}
                      alt="Profile"
                    />
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="label"
                    >
                      <input hidden accept="image/*" type="file" />
                      <PhotoCamera />
                    </IconButton>
                    <Typography variant="caption" textAlign="center">
                      Allowed: .jpeg, .jpg, .png, .gif <br /> Max size: 3MB
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={user?.firstName || ""}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Middle Name"
                        name="middleName"
                        value={user?.middleName || ""}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={user?.lastName || ""}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={user?.username || ""}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="mobileNumber"
                        value={user?.mobileNumber || ""}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        value={user?.email || ""}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="NIN Number"
                        name="nin"
                        value={user?.nin || ""}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="BVN"
                        name="bvn"
                        value={user?.bvn || ""}
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 3,
                }}
              >
                <Box>
                  <Typography component="span">Dark Mode</Typography>
                  <Switch
                    checked={darkMode}
                    onChange={handleDarkModeToggle}
                    color="primary"
                  />
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </Button>
              </Box>
            </Box>
          )}
        </>
      )}
      {tabValue === 1 && <ChangePassword />}
      {tabValue === 2 && <EnableThumbprint />}
      {tabValue === 3 && <StockVending />}
      {/* {tabValue === 4 && <KycForm />}
      {tabValue === 5 && <SetupTransactionPin />} */}
    </Box>
  );
};

export default AccountSettings;
