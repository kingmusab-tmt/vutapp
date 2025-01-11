"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Container,
  Grid,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  CssBaseline,
  Button,
} from "@mui/material";
import {
  Dashboard,
  FourGPlusMobiledata,
  PhoneInTalk,
  Settings,
  Groups,
  ReceiptLong,
  Payments,
  RequestQuote,
  Logout,
  Menu as MenuIcon,
  Bolt,
  Tv,
  Sms,
  Person,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import BuyData from "./buydata/page";
import SettingsSection from "./settings/settings";
import Referrals from "./referrals/referrals";
import Transactions from "./transactions/transactions";
import Pricing from "./pricing/pricing";
import UtilityPayments from "./utilitypayments/utilitypayments";
import BuyAirtime from "./buyairtime/buyairtime";
import FundWallet from "./fundwallet/fundwallet";
import { signOut } from "next-auth/react";

const UserDashboard: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleNavigation = (section: string) => {
    setSelectedSection(section);
    toggleMenu();
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderContent = () => {
    switch (selectedSection) {
      case "dashboard":
        return <MyDashboard handleNavigation={handleNavigation} />;
      case "buy data":
        return <BuyData />;
      case "buy airtime":
        return <BuyAirtime />;
      case "utility payments":
        return <UtilityPayments />;
      case "fund wallet":
        return <FundWallet />;
      case "transactions":
        return <Transactions />;
      case "pricing":
        return <Pricing />;
      case "my referrals":
        return <Referrals />;
      case "settings":
        return <SettingsSection />;
      default:
        return <MyDashboard handleNavigation={handleNavigation} />;
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleMenu}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {/* User Dashboard */}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              {/* Welcome, User Name */}
            </Typography>
            <Avatar
              src="/path/to/profile-picture.jpg"
              alt="User Name"
              onClick={handleMenuOpen}
              sx={{ cursor: "pointer" }}
            />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => handleNavigation("profile")}>Profile</MenuItem>
              <MenuItem onClick={() => handleNavigation("settings")}>Settings</MenuItem>
              <MenuItem onClick={() => signOut()}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={menuOpen}
        onClose={toggleMenu}
        sx={{
          width: menuOpen ? 240 : 60,
          [`& .MuiDrawer-paper`]: {
            width: menuOpen ? 240 : 60,
            boxSizing: "border-box",
            transition: "width 0.3s",
            mt: 8,
          },
        }}
      >
        <List
          sx={{
            pt: 4, // Padding top
          }}
        >
          {[
            { text: "Dashboard", icon: <Dashboard /> },
            { text: "Buy Data", icon: <FourGPlusMobiledata /> },
            { text: "Buy Airtime", icon: <PhoneInTalk /> },
            { text: "Utility Payments", icon: <Payments /> },
            { text: "Fund Wallet", icon: <Payments /> },
            { text: "Transactions", icon: <ReceiptLong /> },
            { text: "Pricing", icon: <RequestQuote /> },
            { text: "My Referrals", icon: <Groups /> },
            { text: "Settings", icon: <Settings /> },
          ].map((item, index) => (
            <Tooltip key={index} title={menuOpen ? "" : item.text} placement="right">
              <ListItem
                component="button"
                sx={{ mb: 1 }}
                onClick={() => handleNavigation(item.text.toLowerCase())}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                {menuOpen && <ListItemText primary={item.text} />}
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {renderContent()}
      </Box>
    </Box>
  );
};

interface MyDashboardProps {
  handleNavigation: (section: string) => void;
}

const MyDashboard: React.FC<MyDashboardProps> = ({ handleNavigation }) => (
  <Container>
    {/* Header Section */}
    <Grid container spacing={3} alignItems="center">
      <Grid item xs={8}>
        <Typography variant="h5">Welcome (User name)</Typography>
        <Typography variant="body1">Message</Typography>
        <Button variant="contained" color="primary" sx={{ marginTop: 2 }}>
          Fund Wallet
        </Button>
      </Grid>
      <Grid item xs={4}>
        <Box
          sx={{
            width: "100%",
            height: "100px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid gray",
          }}
        >
          <Typography variant="h6">Company Logo</Typography>
        </Box>
      </Grid>
    </Grid>

    {/* Membership Section */}
    <Box sx={{ marginY: 3, textAlign: "center" }}>
      <Typography variant="body1">
        You are on: <strong>Smart Earner</strong>
        <Button variant="contained" color="primary">
          Upgrade
        </Button>
      </Typography>
      <Typography variant="body1">
        Refer and Earn:  <strong>Click to Copy Referral Link</strong>
      </Typography>
    </Box>

    {/* Wallet Info Section */}
    <Grid container spacing={3} columns={{ xs: 2, sm: 4, md: 4 }}>
      {[
        "Wallet Balance",
        "Profit from sales",
        "Referral Bonus",
        "Other Bonus",
      ].map((label, index) => (
        <Grid item xs={1} sm={2} key={index}>
          <Paper elevation={3} sx={{ padding: 2, textAlign: "center" }}>
            <Typography variant="h6">{label}</Typography>
            <Typography variant="h4" color="blue">0.00</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>

    {/* Categories Section */}
    <Grid container spacing={3} columns={{ xs: 2, sm: 6, md: 9 }} sx={{ marginTop: 3 }}>
      {[
        { label: "Data", icon: <FourGPlusMobiledata fontSize="large" color="primary" />, section: "buy data" },
        { label: "Airtime", icon: <PhoneInTalk fontSize="large" color="primary" />, section: "buy airtime" },
        { label: "Electricity", icon: <Bolt fontSize="large" color="primary" />, section: "utility payments" },
        { label: "Cable Sub", icon: <Tv fontSize="large" color="primary" />, section: "utility payments" },
        { label: "Bulk SMS", icon: <Sms fontSize="large" color="primary" />, section: "buy data" },

        { label: "Referrals", icon: <Groups fontSize="large" color="primary" />, section: "my referrals" },
        { label: "Transactions", icon: <ReceiptLong fontSize="large" color="primary" />, section: "transactions" },
        { label: "Pricing", icon: <RequestQuote fontSize="large" color="primary" />, section: "pricing" },
        { label: "Profile", icon: <Person fontSize="large" color="primary" />, section: "profile" },
        { label: "Fund Wallet", icon: <Payments fontSize="large" color="primary" />, section: "transactions" },
      ].map((item, index) => (
        <Grid item xs={1} sm={2} key={index}>
          <Paper
            elevation={3}
            sx={{ padding: 2, textAlign: "center", cursor: "pointer" }}
            onClick={() => handleNavigation(item.section)}
          >
            {item.icon}
            <Typography variant="h6">{item.label}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>

    {/* Transaction Statistics Section */}
    <Box sx={{ marginTop: 3 }}>
      <Typography variant="h6" gutterBottom>
        Transaction Statistics
      </Typography>
      <Grid container spacing={3} columns={{ xs: 2, sm: 4, md: 4 }}>
        {[
          "Total Funding",
          "Current Month",
          "Previous Month",
          "Total Data Sold",
        ].map((label, index) => (
          <Grid item xs={1} sm={2} key={index}>
            <Paper elevation={3} sx={{ padding: 2, textAlign: "center" }}>
              <Typography variant="h6">{label}</Typography>
              <Typography variant="h4" color="blue">0.00</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  </Container>
);

export default UserDashboard;