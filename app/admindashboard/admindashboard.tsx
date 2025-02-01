"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  CssBaseline,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import {
  PhoneInTalk,
  Payments,
  ReceiptLong,
  Settings,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { signOut } from "next-auth/react";
import UserManagement from "../components/manageUser";
import ServiceManagement from "../components/manageServices";
import ApiManagement from "../components/manageAPI";
import Transactions from "../components/transactionhistory";
import AccountSettings from "../components/settings";
import Overview from "./overview";

const AdminDashboard: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState("overview");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleNavigation = (section: string) => {
    setSelectedSection(section);
    if (isMobile) toggleMenu();
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderContent = () => {
    switch (selectedSection) {
      case "overview":
        return <Overview />;
      case "users management":
        return <UserManagement />;
      case "services management":
        return <ServiceManagement />;
      case "apis management":
        return <ApiManagement />;
      case "transaction":
        return <Transactions />;
      case "settings":
        return <AccountSettings />;
      default:
        return <Overview />;
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
            Admin Dashboard
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
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
              <MenuItem onClick={() => handleNavigation("profile")}>
                Profile
              </MenuItem>
              <MenuItem onClick={() => handleNavigation("settings")}>
                Settings
              </MenuItem>
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
        <List>
          {[
            { text: "Overview", icon: <PhoneInTalk /> },
            { text: "Users Management", icon: <PhoneInTalk /> },
            { text: "Services Management", icon: <PhoneInTalk /> },
            { text: "Apis Management", icon: <Payments /> },
            { text: "Transaction", icon: <ReceiptLong /> },
            { text: "Settings", icon: <Settings /> },
          ].map((item, index) => (
            <Tooltip
              key={index}
              title={menuOpen ? "" : item.text}
              placement="right"
            >
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

export default AdminDashboard;
