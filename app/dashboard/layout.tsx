"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
    ListItemText,
   Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Divider,
  useMediaQuery,
  useTheme,
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
    Menu as MenuIcon,
  
  ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material";
import { signOut } from "next-auth/react";
import { getUserImage } from "@/lib/getUserImageServerAction";

const menuItems = [
  { text: "Dashboard", icon: <Dashboard />, route: "/dashboard" },
  { text: "Buy Data", icon: <FourGPlusMobiledata />, route: "/dashboard/buydata" },
  { text: "Buy Airtime", icon: <PhoneInTalk />, route: "/dashboard/buyairtime" },
  { text: "Utility Payments", icon: <Payments />, route: "/dashboard/utilitypayments" },
  { text: "Fund Wallet", icon: <Payments />, route: "/dashboard/fundwallet" },
  { text: "Transactions", icon: <ReceiptLong />, route: "/dashboard/transactions" },
  { text: "Pricing", icon: <RequestQuote />, route: "/dashboard/pricing" },
  { text: "My Referrals", icon: <Groups />, route: "/dashboard/myreferrals" },
  { text: "Settings", icon: <Settings />, route: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
    const pathname = usePathname();
    const theme = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
const [image, setImage] = useState("");

    
    useEffect(() => {
        const userInfo = async () => {
          const image = await getUserImage();
          if (image) {
            console.log(image)
            setImage(image);
          }
        };
        userInfo();
    }, []);
    

  const handleNavigation = (route: string) => {
    router.push(route);
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

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />
      {/* AppBar (Top Navbar) */}
      <AppBar position="fixed">
        <Toolbar>
                  <IconButton
                      edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
             onClick={toggleMenu}
          >
            {menuOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography variant="body1" sx={{ mr: 2 }}>
                        {/* Welcome, {username} */}
                      </Typography>
                      <Avatar
                        src={image}
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

      {/* Sidebar (Drawer) */}
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
        <Toolbar />
        <Divider />
        <List>
          {menuItems.map((item, index) => (
            <Tooltip key={index} title={menuOpen ? "" : item.text} placement="right">
              <ListItem
                component="button"
                sx={{
                  mb: 1,
                  bgcolor: pathname === item.route ? "rgba(0, 0, 0, 0.1)" : "transparent",
                }}
                onClick={() => handleNavigation(item.route)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                {menuOpen && <ListItemText primary={item.text} />}
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
}
