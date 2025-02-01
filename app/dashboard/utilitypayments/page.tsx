"use client";

import React, { useState } from "react";
import {
  Typography,
  Container,
  Grid,
  TextField,
  Button,
  ToggleButton,
  Box,
  MenuItem,
  Select,
} from "@mui/material";
import Image from "next/image";
import gotvLogo from "../../../public/images/GOTV.png";
import dstvLogo from "../../../public/images/DStv.png";
import startimeLogo from "../../../public/images/startimes.jpg";

const utilityTypes = ["Cable Payment", "Bill Payment"];
const cableProviders = ["GOTV", "DSTV", "Startime"];
const cablePlans = {
  GOTV: ["Lite Plan", "Max Plan", "Supreme Plan"],
  DSTV: ["Compact", "Compact Plus", "Premium"],
  Startime: ["Basic", "Classic", "Super"],
};
const billTypes = ["Electricity", "Water", "Internet"];
const electricityProviders = [
  "Abuja Electricity",
  "Yola Electricity",
  "Kaduna Electricity",
  "Lagos Electricity",
];

type UtilityType = "Cable Payment" | "Bill Payment";
type CableProvider = keyof typeof cablePlans;
type BillType = "Electricity" | "Water" | "Internet";

type PaymentType = "Prepaid" | "Postpaid";

const UtilityPayments: React.FC = () => {
  const [selectedUtilityType, setSelectedUtilityType] =
    useState<UtilityType | null>(null);
  const [selectedCableProvider, setSelectedCableProvider] =
    useState<CableProvider | null>(null);
  const [selectedCablePlan, setSelectedCablePlan] = useState<string | null>(
    null
  );
  const [iucNumber, setIucNumber] = useState<string>("");

  const [selectedBillType, setSelectedBillType] = useState<BillType | null>(
    null
  );
  const [selectedElectricityProvider, setSelectedElectricityProvider] =
    useState<string | null>(null);
  const [billPaymentType, setBillPaymentType] = useState<PaymentType | null>(
    null
  );
  const [meterNumber, setMeterNumber] = useState<string>("");
  const [billAmount, setBillAmount] = useState<string>("");
  const [customerNumber, setCustomerNumber] = useState<string>("");

  const handleSubmit = () => {
    const payload =
      selectedUtilityType === "Cable Payment"
        ? {
            utilityType: selectedUtilityType,
            cableProvider: selectedCableProvider,
            cablePlan: selectedCablePlan,
            iucNumber,
          }
        : {
            utilityType: selectedUtilityType,
            billType: selectedBillType,
            electricityProvider: selectedElectricityProvider,
            paymentType: billPaymentType,
            meterNumber,
            amount: billAmount,
            customerNumber,
          };

    console.log(payload);
    // Send the information to the backend
  };

  const isCablePaymentComplete =
    selectedCableProvider && selectedCablePlan && iucNumber;
  const isBillPaymentComplete =
    selectedBillType === "Electricity"
      ? selectedElectricityProvider &&
        billPaymentType &&
        meterNumber &&
        billAmount &&
        customerNumber
      : selectedBillType &&
        billPaymentType &&
        meterNumber &&
        billAmount &&
        customerNumber;

  const isSubmitEnabled =
    selectedUtilityType === "Cable Payment"
      ? isCablePaymentComplete
      : isBillPaymentComplete;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Utility Payment
      </Typography>

      {/* Select Utility Type */}
      <Typography variant="h6" sx={{ marginBottom: "10px" }}>
        Select Utility Type
      </Typography>
      <Grid container spacing={2}>
        {utilityTypes.map((type) => (
          <Grid item xs={6} key={type}>
            <ToggleButton
              value={type}
              selected={selectedUtilityType === type}
              onClick={() => {
                setSelectedUtilityType(type as UtilityType);
                setSelectedCableProvider(null);
                setSelectedCablePlan(null);
                setSelectedBillType(null);
                setSelectedElectricityProvider(null);
                setBillPaymentType(null);
                setMeterNumber("");
                setBillAmount("");
                setCustomerNumber("");
              }}
              sx={{ width: "100%", height: "50px" }}
            >
              {type}
            </ToggleButton>
          </Grid>
        ))}
      </Grid>

      {/* Cable Payment */}
      {selectedUtilityType === "Cable Payment" && (
        <>
          <Typography variant="h6" sx={{ mt: 5, mb: 2 }}>
            Select Cable Provider
          </Typography>
          <Grid container spacing={2}>
            {cableProviders.map((provider) => (
              <Grid item xs={4} key={provider}>
                <ToggleButton
                  value={provider}
                  selected={selectedCableProvider === provider}
                  onClick={() =>
                    setSelectedCableProvider(provider as CableProvider)
                  }
                  sx={{ width: "100%", height: { xs: "250%", lg: "150px" } }}
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
                        provider === "GOTV"
                          ? gotvLogo
                          : provider === "DSTV"
                          ? dstvLogo
                          : startimeLogo
                      }
                      alt={provider}
                      layout="fill"
                      objectFit="fill"
                    />
                  </Box>
                </ToggleButton>
              </Grid>
            ))}
          </Grid>

          {selectedCableProvider && (
            <>
              <Typography variant="h6" sx={{ mt: 5 }}>
                Select Cable Plan
              </Typography>
              <Select
                fullWidth
                value={selectedCablePlan || ""}
                onChange={(e) => setSelectedCablePlan(e.target.value)}
                displayEmpty
                sx={{ mb: 2 }}
              >
                <MenuItem value="" disabled>
                  Select Plan
                </MenuItem>
                {cablePlans[selectedCableProvider].map((plan) => (
                  <MenuItem key={plan} value={plan}>
                    {plan}
                  </MenuItem>
                ))}
              </Select>

              <Typography variant="h6" sx={{ mt: 3 }}>
                IUC Number
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter IUC number"
                value={iucNumber}
                onChange={(e) => setIucNumber(e.target.value)}
                sx={{ mb: 2 }}
              />
            </>
          )}
        </>
      )}

      {/* Bill Payment */}
      {selectedUtilityType === "Bill Payment" && (
        <>
          <Typography variant="h6" sx={{ mt: 5, mb: 2 }}>
            Select Bill Type
          </Typography>
          <Select
            fullWidth
            value={selectedBillType || ""}
            onChange={(e) => setSelectedBillType(e.target.value as BillType)}
            displayEmpty
            sx={{ mb: 2 }}
          >
            <MenuItem value="" disabled>
              Select Bill Type
            </MenuItem>
            {billTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>

          {selectedBillType === "Electricity" && (
            <>
              <Typography variant="h6" sx={{ mt: 3 }}>
                Select Electricity Provider
              </Typography>
              <Select
                fullWidth
                value={selectedElectricityProvider || ""}
                onChange={(e) => setSelectedElectricityProvider(e.target.value)}
                displayEmpty
                sx={{ mb: 2 }}
              >
                <MenuItem value="" disabled>
                  Select Provider
                </MenuItem>
                {electricityProviders.map((provider) => (
                  <MenuItem key={provider} value={provider}>
                    {provider}
                  </MenuItem>
                ))}
              </Select>
            </>
          )}

          {selectedBillType && (
            <>
              <Typography variant="h6" sx={{ mt: 3 }}>
                Payment Type
              </Typography>
              <Select
                fullWidth
                value={billPaymentType || ""}
                onChange={(e) =>
                  setBillPaymentType(e.target.value as PaymentType)
                }
                displayEmpty
                sx={{ mb: 2 }}
              >
                <MenuItem value="" disabled>
                  Select Payment Type
                </MenuItem>
                <MenuItem value="Prepaid">Prepaid</MenuItem>
                <MenuItem value="Postpaid">Postpaid</MenuItem>
              </Select>

              <Typography variant="h6" sx={{ mt: 3 }}>
                Meter Number
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter Meter Number"
                value={meterNumber}
                onChange={(e) => setMeterNumber(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Typography variant="h6" sx={{ mt: 3 }}>
                Amount
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter Amount"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Typography variant="h6" sx={{ mt: 3 }}>
                Customer Number
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter Customer Number"
                value={customerNumber}
                onChange={(e) => setCustomerNumber(e.target.value)}
                sx={{ mb: 2 }}
              />
            </>
          )}
        </>
      )}

      {/* Submit Button */}
      {isSubmitEnabled && (
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          Submit
        </Button>
      )}
    </Container>
  );
};

export default UtilityPayments;
