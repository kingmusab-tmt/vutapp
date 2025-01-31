"use client";

import React, { useState } from "react";
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
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [bypass, setBypass] = useState<boolean>(false);

  const handleNetworkSelect = (network: NetworkKeys) => {
    setSelectedNetwork(network);
    setSelectedAirtimeType(null);
    setAmount("");
  };

  const handleAirtimeTypeSelect = (type: AirtimeType) => {
    setSelectedAirtimeType(type);
  };

  const handleSubmit = () => {
    console.log({
      network: selectedNetwork,
      airtimeType: selectedAirtimeType,
      amount,
      phoneNumber,
      bypass,
    });
    // Send the information to the backend
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
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
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
