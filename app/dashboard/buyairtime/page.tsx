"use client";

import React, { useEffect, useState } from "react";
import {
  Typography,
  Container,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  ToggleButton,
  Box,
} from "@mui/material";
import Image from "next/image";
import mtnLogo from "../../../public/images/mtn.png";
import airtelLogo from "../../../public/images/aritel.png";
import mobile9Logo from "../../../public/images/9mobile.png";
import gloLogo from "../../../public/images/glo.jpg";
import { useSession } from "next-auth/react";
import axios from "axios";

const airtimeTypes = ["VTU", "Share and Sell"];

type AirtimeType = "VTU" | "Share and Sell";
type NetworkKeys = "MTN" | "Airtel" | "Glo" | "9Mobile";

const BuyAirtime: React.FC = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkKeys | null>(
    null
  );
  const [selectedAirtimeType, setSelectedAirtimeType] =
    useState<AirtimeType | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [bypass, setBypass] = useState<boolean>(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [airtimePlan, setAirtimePlan] = useState<{
    network: string;
    airtimeType: string;
    smartEarnerPercent: number;
    affiliatePercent: number;
    topUserPercent: number;
  } | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        if (!session?.user?.email) return;
        const response = await axios.get(
          `/api/users/getSingleUser?email=${session.user.email}`
        );
        setUserType(response.data.userType);
        setUserId(response.data._id);
      } catch (error) {
        console.error("Error fetching user type:", error);
      }
    };

    fetchUserType();
  }, [session]);

  const handleNetworkSelect = (network: NetworkKeys) => {
    setSelectedNetwork(network);
    setSelectedAirtimeType(null);
    setAmount("");
  };

  const handleAirtimeTypeSelect = (type: AirtimeType) => {
    setSelectedAirtimeType(type);
  };

  const handleSubmit = async () => {
    if (!selectedNetwork || !selectedAirtimeType || !amount || !mobileNumber) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const airtimePlanResponse = await axios.get(
        `/api/airtimeplan?network=${selectedNetwork}&airtimeType=${selectedAirtimeType}`
      );
      setAirtimePlan(airtimePlanResponse.data);

      const payload = {
        network: selectedNetwork,
        airtimeType: selectedAirtimeType,
        amount: parseFloat(amount), // Convert amount to a number
        phone: mobileNumber,
        bypass,
        userId,
        userType,
        airtimePlan,
      };

      const purchaseResponse = await fetch("/api/buyairtime", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await purchaseResponse.json();
      console.log("API Response:", data);

      if (purchaseResponse.ok) {
        alert("Airtime purchase successful!");
      } else {
        alert(`Error: ${data.error || "Failed to process request"}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while processing your request.");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Buy Airtime
      </Typography>

      {/* Select Network */}
      <Typography variant="h6" sx={{ marginBottom: "10px" }}>
        Select the network you want
      </Typography>
      <Grid container spacing={2}>
        {["MTN", "Airtel", "Glo", "9Mobile"].map((network) => (
          <Grid item xs={3} key={network}>
            <ToggleButton
              value={network}
              selected={selectedNetwork === network}
              onClick={() => handleNetworkSelect(network as NetworkKeys)}
              sx={{
                width: "100%",
                height: { xs: "250%", lg: "150px" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: "80%",
                  height: "80%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  src={
                    network === "MTN"
                      ? mtnLogo
                      : network === "Airtel"
                      ? airtelLogo
                      : network === "Glo"
                      ? gloLogo
                      : mobile9Logo
                  }
                  alt={network}
                  layout="fill"
                  objectFit="fill"
                />
              </Box>
            </ToggleButton>
          </Grid>
        ))}
      </Grid>

      {/* Select Airtime Type */}
      {selectedNetwork && (
        <>
          <Typography variant="h6" sx={{ mt: 5, mb: 2 }}>
            Select Airtime Type
          </Typography>
          <Grid container spacing={2}>
            {airtimeTypes.map((type) => (
              <Grid item xs={6} key={type}>
                <ToggleButton
                  value={type}
                  selected={selectedAirtimeType === type}
                  onClick={() => handleAirtimeTypeSelect(type as AirtimeType)}
                  sx={{ width: "100%", height: "50px" }}
                >
                  {type}
                </ToggleButton>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Airtime Amount */}
      {selectedNetwork && selectedAirtimeType && (
        <>
          <Typography variant="h6" sx={{ mt: 3 }}>
            Enter Airtime Amount
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={{ mb: 2 }}
          />
        </>
      )}

      {/* Phone Number */}
      {selectedNetwork && selectedAirtimeType && (
        <>
          <Typography variant="h6" sx={{ mt: 3 }}>
            Phone Number
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter phone number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={bypass}
                onChange={(e) => setBypass(e.target.checked)}
              />
            }
            label="Bypass Phone Number"
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </>
      )}
    </Container>
  );
};

export default BuyAirtime;
