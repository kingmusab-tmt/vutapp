"use client";

import React, { useState } from "react";
import {
  Typography,
  Container,
  Grid,
  ToggleButton,
  TextField,
  Button,
  Box,
} from "@mui/material";

const FundWallet: React.FC = () => {
  const [fundingMethod, setFundingMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [reservedAccounts, setReservedAccounts] = useState<any[]>([]); // Replace 'any' with the reserved account type
  const [oneTimeAccount, setOneTimeAccount] = useState<any | null>(null); // Replace 'any' with the one-time account type

  const fetchReservedAccounts = async () => {
    // Fetch reserved accounts from the database
    const response = await fetch("/api/reserved-accounts");
    const data = await response.json();
    setReservedAccounts(data);
  };

  const fetchOneTimeAccount = async () => {
    // Fetch one-time account from the account provider API
    const response = await fetch("/api/one-time-account");
    const data = await response.json();
    setOneTimeAccount(data);
  };

  const handleFundingMethodSelect = (method: string) => {
    setFundingMethod(method);
    setAmount("");

    if (method === "Reserved Account") {
      fetchReservedAccounts();
    } else if (method === "One Time Account") {
      fetchOneTimeAccount();
    }
  };

  const handlePayWithATM = () => {
    if (!amount) {
      alert("Please enter an amount");
      return;
    }

    // Integrate Paystack or other payment provider here
    console.log("Processing payment with Paystack for amount:", amount);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Fund Wallet
      </Typography>

      {/* Funding Method Selection */}
      <Typography variant="h6" gutterBottom>
        Select Funding Method
      </Typography>
      <Grid container spacing={2}>
        {["ATM", "Reserved Account", "One Time Account"].map((method) => (
          <Grid item xs={4} key={method}>
            <ToggleButton
              value={method}
              selected={fundingMethod === method}
              onClick={() => handleFundingMethodSelect(method)}
              sx={{ width: "100%", height: "50px" }}
            >
              {method}
            </ToggleButton>
          </Grid>
        ))}
      </Grid>

      {/* Fund with ATM */}
      {fundingMethod === "ATM" && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Enter Amount</Typography>
          <TextField
            fullWidth
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handlePayWithATM}
          >
            Pay with ATM
          </Button>
        </Box>
      )}

      {/* Fund with Reserved Account */}
      {fundingMethod === "Reserved Account" && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Reserved Account Details</Typography>
          {reservedAccounts.length > 0 ? (
            reservedAccounts.map((account, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography>Bank Name: {account.bankName}</Typography>
                <Typography>Account Number: {account.accountNumber}</Typography>
                <Typography>Account Name: {account.accountName}</Typography>
              </Box>
            ))
          ) : (
            <Typography>Loading reserved accounts...</Typography>
          )}
        </Box>
      )}

      {/* Fund with One Time Account */}
      {fundingMethod === "One Time Account" && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">One Time Account Details</Typography>
          {oneTimeAccount ? (
            <Box>
              <Typography>Bank Name: {oneTimeAccount.bankName}</Typography>
              <Typography>Account Number: {oneTimeAccount.accountNumber}</Typography>
              <Typography>Account Name: {oneTimeAccount.accountName}</Typography>
            </Box>
          ) : (
            <Typography>Loading one-time account details...</Typography>
          )}
        </Box>
      )}
    </Container>
  );
};

export default FundWallet;
