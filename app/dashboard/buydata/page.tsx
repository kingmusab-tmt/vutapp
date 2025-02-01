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

const plans = {
  MTN: {
    CG: ["1GB N230", "2GB N460"],
    SME: ["3GB N690", "5GB N1150", "10GB N2300"],
    gifting: ["3GB N750", "5GB N1200"],
  },
  Airtel: {
    CG: ["1GB N250", "2GB N500"],
    gifting: ["3GB N750", "5GB N1200"],
  },
  Glo: {
    CG: ["1GB N200", "2GB N400"],
    gifting: ["3GB N750", "5GB N1200"],
  },
  "9Mobile": {
    SME: ["1GB N270", "2GB N470"],
    gifting: ["3GB N700", "5GB N1250"],
  },
};

type PlanKeys = keyof typeof plans;
type PlanTypes = keyof (typeof plans)[PlanKeys];

const BuyData: React.FC = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<PlanKeys | null>(null);
  const [selectedPlanType, setSelectedPlanType] = useState<PlanTypes | null>(
    null
  );
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [bypass, setBypass] = useState<boolean>(false);

  const handleNetworkSelect = (network: PlanKeys) => {
    setSelectedNetwork(network);
    setSelectedPlanType(null);
    setSelectedPlan(null);
  };

  const handlePlanTypeSelect = (planType: PlanTypes) => {
    setSelectedPlanType(planType);
    setSelectedPlan(null);
  };

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
  };

  const handleSubmit = () => {
    console.log({
      network: selectedNetwork,
      planType: selectedPlanType,
      plan: selectedPlan,
      phoneNumber,
      bypass,
    });
    // Send the information to the backend
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Buy Data
      </Typography>

      {/* Select Network */}
      <Typography variant="h6" sx={{ marginBottom: "10px" }}>
        Click Network You want to
      </Typography>
      <Grid container spacing={2}>
        {Object.keys(plans).map((network) => (
          <Grid item xs={3} key={network}>
            <ToggleButton
              value={network}
              selected={selectedNetwork === network}
              onClick={() => handleNetworkSelect(network as PlanKeys)}
              sx={{
                width: { xs: "100%", lg: "100px" },
                height: { xs: "250%", lg: "100px" },
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
                  //
                />
              </Box>
            </ToggleButton>
          </Grid>
        ))}
      </Grid>

      {/* Select Plan Type */}
      {selectedNetwork && (
        <>
          <Typography variant="h6" sx={{ mt: 5, mb: 2 }}>
            Select Plan Type
          </Typography>
          <Grid container spacing={2}>
            {Object.keys(plans[selectedNetwork]).map((planType) => (
              <Grid item xs={3} key={planType}>
                <ToggleButton
                  value={planType}
                  selected={selectedPlanType === planType}
                  onClick={() => handlePlanTypeSelect(planType as PlanTypes)}
                  sx={{ width: "100%", height: "50px" }}
                >
                  {planType}
                </ToggleButton>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Select Plan */}
      {selectedNetwork && selectedPlanType && (
        <>
          <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
            Select Plan
          </Typography>
          <Grid container spacing={2}>
            {(
              plans[selectedNetwork][
                selectedPlanType as keyof (typeof plans)[PlanKeys]
              ] || []
            ).map((plan) => (
              <Grid item xs={3} key={plan}>
                <ToggleButton
                  value={plan}
                  selected={selectedPlan === plan}
                  onClick={() => handlePlanSelect(plan)}
                  sx={{ width: "100%", height: "50px" }}
                >
                  {plan}
                </ToggleButton>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Phone Number */}
      {selectedNetwork && selectedPlanType && selectedPlan && (
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

export default BuyData;
