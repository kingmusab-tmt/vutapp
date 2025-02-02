"use client";

import React, { useState, useEffect } from "react";
import {
  Typography,
  Container,
  Grid,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    // Fetch transactions from the database
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions"); // Update the endpoint as needed
        const data = await response.json();
        setTransactions(data);
        setFilteredTransactions(data);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  // Filter transactions by type or search query
  useEffect(() => {
    let filtered = transactions;

    if (filterType) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.type.toLowerCase() === filterType.toLowerCase()
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((transaction) =>
        transaction.mobileNumber?.includes(searchQuery)
      );
    }

    setFilteredTransactions(filtered);
  }, [filterType, searchQuery, transactions]);

  const renderTransactionRow = (transaction: any) => {
    switch (transaction.type) {
      case "Airtime":
        return (
          <TableRow key={transaction.id}>
            <TableCell>{transaction.network}</TableCell>
            <TableCell>{transaction.amount}</TableCell>
            <TableCell>{transaction.prevBalance}</TableCell>
            <TableCell>{transaction.currentBalance}</TableCell>
            <TableCell>{transaction.mobileNumber}</TableCell>
            <TableCell>{transaction.date}</TableCell>
            <TableCell>{transaction.status}</TableCell>
            <TableCell>
              <Button variant="outlined">View Details</Button>
            </TableCell>
          </TableRow>
        );
      case "Data":
        return (
          <TableRow key={transaction.id}>
            <TableCell>{transaction.plan}</TableCell>
            <TableCell>{transaction.planAmount}</TableCell>
            <TableCell>{transaction.mobileNumber}</TableCell>
            <TableCell>{transaction.prevBalance}</TableCell>
            <TableCell>{transaction.currentBalance}</TableCell>
            <TableCell>{transaction.date}</TableCell>
            <TableCell>{transaction.status}</TableCell>
            <TableCell>
              <Button variant="outlined">View Details</Button>
            </TableCell>
          </TableRow>
        );
      case "Cable Sub":
        return (
          <TableRow key={transaction.id}>
            <TableCell>{transaction.provider}</TableCell>
            <TableCell>{transaction.iucNumber}</TableCell>
            <TableCell>{transaction.prevBalance}</TableCell>
            <TableCell>{transaction.currentBalance}</TableCell>
            <TableCell>{transaction.plan}</TableCell>
            <TableCell>{transaction.date}</TableCell>
            <TableCell>{transaction.status}</TableCell>
            <TableCell>
              <Button variant="outlined">View Details</Button>
            </TableCell>
          </TableRow>
        );
      case "Electricity":
        return (
          <TableRow key={transaction.id}>
            <TableCell>{transaction.provider}</TableCell>
            <TableCell>{transaction.meterNumber}</TableCell>
            <TableCell>{transaction.amount}</TableCell>
            <TableCell>{transaction.prevBalance}</TableCell>
            <TableCell>{transaction.currentBalance}</TableCell>
            <TableCell>{transaction.date}</TableCell>
            <TableCell>{transaction.status}</TableCell>
            <TableCell>
              <Button variant="outlined">View Details</Button>
            </TableCell>
          </TableRow>
        );
      case "Deposit":
        return (
          <TableRow key={transaction.id}>
            <TableCell>{transaction.amount}</TableCell>
            <TableCell>{transaction.prevBalance}</TableCell>
            <TableCell>{transaction.currentBalance}</TableCell>
            <TableCell>{transaction.date}</TableCell>
            <TableCell>{transaction.status}</TableCell>
            <TableCell>
              <Button variant="outlined">View Details</Button>
            </TableCell>
          </TableRow>
        );
      case "Withdrawl":
        return (
          <TableRow key={transaction.id}>
            <TableCell>{transaction.amount}</TableCell>
            <TableCell>{transaction.prevBalance}</TableCell>
            <TableCell>{transaction.currentBalance}</TableCell>
            <TableCell>{transaction.date}</TableCell>
            <TableCell>{transaction.status}</TableCell>
            <TableCell>
              <Button variant="outlined">View Details</Button>
            </TableCell>
          </TableRow>
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Transactions
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Filter by Type</InputLabel>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Data">Data</MenuItem>
              <MenuItem value="Airtime">Airtime</MenuItem>
              <MenuItem value="Cable Sub">Cable Subscription</MenuItem>
              <MenuItem value="Electricity">Electricity</MenuItem>
              <MenuItem value="Deposit">Deposit</MenuItem>
              <MenuItem value="Withdrawl">Withdrawal</MenuItem>
              <MenuItem value="Bonus">Bonus</MenuItem>
              <MenuItem value="Manual Funding">Manual Funding</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Search by Phone Number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Grid>
      </Grid>

      {/* Transactions Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Details</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) =>
                renderTransactionRow(transaction)
              )
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No Transactions Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Transactions;
