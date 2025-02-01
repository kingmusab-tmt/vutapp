"use client";

import React, { useState, useEffect } from "react";
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
import axios from "axios";
import { useSession } from "next-auth/react";
import mtnLogo from "../../../public/images/mtn.png";
import airtelLogo from "../../../public/images/aritel.png";
import mobile9Logo from "../../../public/images/9mobile.png";
import gloLogo from "../../../public/images/glo.jpg";

interface Plan {
  label: string;
  apiDetails: any;
}

const BuyData: React.FC = () => {
  const { data: session } = useSession();
  const [plans, setPlans] = useState<Record<string, Record<string, Plan[]>>>(
    {}
  );

  const [userType, setUserType] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [selectedPlanType, setSelectedPlanType] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [bypass, setBypass] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        if (!session?.user?.email) return;
        const response = await axios.get(
          `/api/users/getSingleUser?email=${session.user.email}`
        );
        console.log(response.data.userType);
        setUserType(response.data.userType);
      } catch (error) {
        console.error("Error fetching user type:", error);
      }
    };

    fetchUserType();
  }, [session]);

  useEffect(() => {
    const fetchDataPlans = async () => {
      try {
        if (!userType) return;
        const response = await axios.get("/api/data"); // Replace with actual API endpoint
        const dataPlans = response.data;

        const newPlans: Record<string, Record<string, Plan[]>> = {};

        dataPlans.forEach((plan: any) => {
          const {
            network,
            planType,
            planSize,
            planVolume,
            apiDetails,
            smartEarnerPrice,
            affiliatePrice,
            topUserPrice,
          } = plan;
          console.log(plan);
          let planPrice;
          if (userType === "Smart Earner") {
            planPrice = smartEarnerPrice;
          } else if (userType === "Affiliate User") {
            planPrice = affiliatePrice;
          } else if (userType === "Top User") {
            planPrice = topUserPrice;
          }
          console.log(planSize);
          console.log(planVolume);
          console.log(planPrice);
          const planLabel = `${planSize}${planVolume} N${planPrice}`;

          if (!newPlans[network]) {
            newPlans[network] = {};
          }
          if (!newPlans[network][planType]) {
            newPlans[network][planType] = [];
          }
          newPlans[network][planType].push({ label: planLabel, apiDetails });
        });
        console.log(newPlans);
        setPlans(newPlans);
      } catch (error) {
        console.error("Error fetching data plans:", error);
      }
    };

    fetchDataPlans();
  }, [userType]);

  const handleNetworkSelect = (network: string) => {
    setSelectedNetwork(network);
    setSelectedPlanType(null);
    setSelectedPlan(null);
  };

  const handlePlanTypeSelect = (planType: string) => {
    setSelectedPlanType(planType);
    setSelectedPlan(null);
  };

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handleSubmit = async () => {
    const datasub = {
      network: selectedNetwork,
      planType: selectedPlanType,
      apiDetails: Array.isArray(selectedPlan?.apiDetails)
        ? selectedPlan.apiDetails.map((detail) => ({ ...detail })) // Ensure it's an array of plain objects
        : selectedPlan?.apiDetails ?? {}, // Default to an empty object
      phoneNumber,
      bypass,
    };
    console.log("Data being sent:", JSON.stringify(datasub, null, 2));
    try {
      const response = await axios.post(
        "/api/buydata",
        JSON.stringify({ data: datasub }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.status === true) {
        console.log("Successful transaction!", response.data.api_response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Buy Data
      </Typography>

      <Typography variant="h6" sx={{ marginBottom: "10px" }}>
        Click Network You want to
      </Typography>
      <Grid container spacing={2}>
        {Object.keys(plans).map((network) => (
          <Grid item xs={3} key={network}>
            <ToggleButton
              value={network}
              selected={selectedNetwork === network}
              onClick={() => handleNetworkSelect(network)}
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
                />
              </Box>
            </ToggleButton>
          </Grid>
        ))}
      </Grid>

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
                  onClick={() => handlePlanTypeSelect(planType)}
                  sx={{ width: "100%", height: "50px" }}
                >
                  {planType}
                </ToggleButton>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {selectedNetwork && selectedPlanType && (
        <>
          <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
            Select Plan
          </Typography>
          <Grid container spacing={2}>
            {plans[selectedNetwork][selectedPlanType].map((plan, index) => (
              <Grid item xs={3} key={index}>
                <ToggleButton
                  value={plan.label}
                  selected={selectedPlan?.label === plan.label}
                  onClick={() => handlePlanSelect(plan)}
                  sx={{ width: "100%", height: "50px" }}
                >
                  {plan.label}
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
