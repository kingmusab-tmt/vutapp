"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Typography,
  Box,
  Container,
  Grid,
  Paper,
  Button,
  Modal,
} from "@mui/material";
import {
  FourGPlusMobiledata,
  PhoneInTalk,
  Groups,
  ReceiptLong,
  Payments,
  RequestQuote,
  Bolt,
  Tv,
  Sms,
  Person,
} from "@mui/icons-material";
import { getUserName } from "@/lib/getUserNameServerAction";
import KycForm from "../components/kyc";

export default function DashboardHome() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [username, setUsername] = useState("");
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userName = await getUserName();
      if (userName) {
        setUsername(userName);
      }

      // Show modal if user is logging in for the first time
      if (session?.user && !session.user.hasSeenModal) {
        setOpenModal(true);
      }
    };

    fetchUserInfo();
  }, [session]);

  const handleCloseModal = async () => {
    setOpenModal(false);

    // Update hasSeenModal in the database
    await fetch("/api/users/updateuser", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hasSeenModal: true }),
    });

    // Update session to reflect the change
    update({ hasSeenModal: true });
  };

  const handleNavigation = (section: string) => {
    router.push(`/dashboard/${section}`);
  };

  return (
    <Container>
      {/* Header Section */}
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={8}>
          <Typography variant="h5">Welcome, {username} </Typography>
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
          Refer and Earn: <strong>Click to Copy Referral Link</strong>
        </Typography>
      </Box>

      {/* Wallet Info Section */}
      <Grid container spacing={3}>
        {[
          "Wallet Balance",
          "Profit from sales",
          "Referral Bonus",
          "Other Bonus",
        ].map((label, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper elevation={3} sx={{ padding: 2, textAlign: "center" }}>
              <Typography variant="h6">{label}</Typography>
              <Typography variant="h4" color="blue">
                0.00
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Categories Section */}
      <Grid container spacing={3} sx={{ marginTop: 3 }}>
        {[
          {
            label: "Data",
            icon: <FourGPlusMobiledata fontSize="large" color="primary" />,
            section: "buydata",
          },
          {
            label: "Airtime",
            icon: <PhoneInTalk fontSize="large" color="primary" />,
            section: "buyairtime",
          },
          {
            label: "Electricity",
            icon: <Bolt fontSize="large" color="primary" />,
            section: "utilitypayments",
          },
          {
            label: "Cable Sub",
            icon: <Tv fontSize="large" color="primary" />,
            section: "utilitypayments",
          },
          {
            label: "Bulk SMS",
            icon: <Sms fontSize="large" color="primary" />,
            section: "buydata",
          },
          {
            label: "Referrals",
            icon: <Groups fontSize="large" color="primary" />,
            section: "myreferrals",
          },
          {
            label: "Transactions",
            icon: <ReceiptLong fontSize="large" color="primary" />,
            section: "transactions",
          },
          {
            label: "Pricing",
            icon: <RequestQuote fontSize="large" color="primary" />,
            section: "pricing",
          },
          {
            label: "Profile",
            icon: <Person fontSize="large" color="primary" />,
            section: "settings",
          },
          {
            label: "Fund Wallet",
            icon: <Payments fontSize="large" color="primary" />,
            section: "fundwallet",
          },
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
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
        <Grid container spacing={3}>
          {[
            "Total Funding",
            "Current Month",
            "Previous Month",
            "Total Data Sold",
          ].map((label, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper elevation={3} sx={{ padding: 2, textAlign: "center" }}>
                <Typography variant="h6">{label}</Typography>
                <Typography variant="h4" color="blue">
                  0.00
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* KYC Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "white",
            p: 2,
            borderRadius: 2,
            boxShadow: 24,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Complete Your KYC
          </Typography>
          <KycForm handleCloseModal={handleCloseModal} />{" "}
          {/* Render the KYC Form */}
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleCloseModal}>
            Dismiss
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}
