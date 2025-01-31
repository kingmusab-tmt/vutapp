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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";

type DataPricing = {
  network: string;
  gb: number;
  smartEarnerPrice: number;
  advanceEarnerPrice: number;
  apiUserPrice: number;
};

type Pricing = {
  category: string;
  provider: string;
  type: string;
  price: number;
  dataPricing?: DataPricing[];
};

type Filter = {
  category: string;
  provider: string;
};

const Pricing: React.FC = () => {
  const [pricing, setPricing] = useState<Pricing[]>([]);
  const [filteredPricing, setFilteredPricing] = useState<Pricing[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [filters, setFilters] = useState<Filter>({
    category: "",
    provider: "",
  });

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await axios.get<Pricing[]>("/api/pricing"); // Replace with your API endpoint
        setPricing(response.data);
        setFilteredPricing(response.data);
      } catch (error) {
        console.error("Error fetching pricing:", error);
      }
    };

    fetchPricing();
  }, []);

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const applyFilters = () => {
      let updatedPricing = pricing;

      if (filters.category) {
        updatedPricing = updatedPricing.filter((item) =>
          item.category.toLowerCase().includes(filters.category.toLowerCase())
        );
      }

      if (filters.provider) {
        updatedPricing = updatedPricing.filter((item) =>
          item.provider.toLowerCase().includes(filters.provider.toLowerCase())
        );
      }

      setFilteredPricing(updatedPricing);
    };

    applyFilters();
  }, [filters, pricing]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPricing = filteredPricing.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Pricing Details
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Filter by Category"
            variant="outlined"
            fullWidth
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Filter by Provider"
            variant="outlined"
            fullWidth
            name="provider"
            value={filters.provider}
            onChange={handleFilterChange}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {currentPricing.map((item, index) => (
          <Grid item xs={12} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {item.category} - {item.provider}
                </Typography>
                {item.category === "Data" && item.dataPricing ? (
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>GB</TableCell>
                          <TableCell>Smart Earner Price</TableCell>
                          <TableCell>Advance Earner Price</TableCell>
                          <TableCell>API User Price</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {item.dataPricing.map((data, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{data.gb} GB</TableCell>
                            <TableCell>₦{data.smartEarnerPrice}</TableCell>
                            <TableCell>₦{data.advanceEarnerPrice}</TableCell>
                            <TableCell>₦{data.apiUserPrice}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2">Price: ₦{item.price}</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Pagination
        count={Math.ceil(filteredPricing.length / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        sx={{ mt: 3, display: "flex", justifyContent: "center" }}
      />
    </Container>
  );
};

export default Pricing;
