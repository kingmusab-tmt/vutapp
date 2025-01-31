import React from "react";
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
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import EnableThumbprint from "../dashboard/settings/enablethumbprint/page";
import ChangePassword from "../dashboard/settings/changetransactionpin/page";
import StockVending from "../dashboard/settings/stockvending/page";

const AccountSettings: React.FC = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const [darkMode, setDarkMode] = React.useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDarkModeToggle = () => {
    setDarkMode((prev) => !prev);
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
        <Tab label="Change Transaction Pin" />
        <Tab label="Thumbprint" />
        <Tab label="Stock Vending" />
      </Tabs>

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
                  src=""
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
                  Allowed: .jpeg, .jpg, .png, .gif <br />
                  Max size: 3MB
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    defaultValue="Musab Mubaraq Mburaimoh"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Username"
                    defaultValue="kingmusab2"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    defaultValue="08179088371"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    defaultValue="musab.buraimoh@gmail.com"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="NIN Number" />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="BVN" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Address" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Webhook URL" />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="About"
                    multiline
                    rows={3}
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
            <Button variant="contained" color="primary">
              Save Changes
            </Button>
          </Box>
        </Box>
      )}

      {tabValue === 1 && <ChangePassword />}
      {tabValue === 2 && <EnableThumbprint />}
      {tabValue === 3 && <StockVending />}
    </Box>
  );
};

export default AccountSettings;
