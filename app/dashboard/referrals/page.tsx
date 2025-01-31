"use client";

import React, { useEffect, useState } from "react";
import {
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
  TextField,
  Pagination,
} from "@mui/material";
import axios from "axios";
import Image from "next/image";

type Referral = {
  id: string;
  picture: string;
  name: string;
  email: string;
  phone: string;
  dateJoined: string;
  lastLogin: string;
};

const Referrals: React.FC = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [filteredReferrals, setFilteredReferrals] = useState<Referral[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [filters, setFilters] = useState({
    dateJoined: "",
    lastLogin: "",
  });

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await axios.get("/api/referrals"); // Replace with your API endpoint
        if (response){
        setReferrals(response.data as Referral[]);
          setFilteredReferrals(response.data as Referral[]);
          }
      } catch (error) {
        console.error("Error fetching referrals:", error);
      }
    };

    fetchReferrals();
  }, []);

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const applyFilters = () => {
      let updatedReferrals = referrals;

      if (filters.dateJoined) {
        updatedReferrals = updatedReferrals.filter((referral) =>
          referral.dateJoined.includes(filters.dateJoined)
        );
      }

      if (filters.lastLogin) {
        updatedReferrals = updatedReferrals.filter((referral) =>
          referral.lastLogin.includes(filters.lastLogin)
        );
      }

      setFilteredReferrals(updatedReferrals);
    };

    applyFilters();
  }, [filters, referrals]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReferrals = filteredReferrals.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        My Referrals
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Filter by Date Joined"
            variant="outlined"
            fullWidth
            name="dateJoined"
            value={filters.dateJoined}
            onChange={handleFilterChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Filter by Last Login"
            variant="outlined"
            fullWidth
            name="lastLogin"
            value={filters.lastLogin}
            onChange={handleFilterChange}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {currentReferrals.map((referral) => (
          <Grid item xs={12} sm={6} md={4} key={referral.id}>
            <Card>
              <CardContent>
                <Image
                  src={referral.picture}
                  alt={referral.name}
                  style={{ width: "100%", borderRadius: "8px" }}
                />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  {referral.name}
                </Typography>
                <Typography variant="body2">Email: {referral.email}</Typography>
                <Typography variant="body2">Phone: {referral.phone}</Typography>
                <Typography variant="body2">
                  Date Joined: {new Date(referral.dateJoined).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  Last Login: {new Date(referral.lastLogin).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Pagination
        count={Math.ceil(filteredReferrals.length / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        sx={{ mt: 3, display: "flex", justifyContent: "center" }}
      />
    </Container>
  );
};

export default Referrals;
