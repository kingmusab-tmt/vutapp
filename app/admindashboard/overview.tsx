import React, { useState } from "react";
import axios from "axios";
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DateTime } from "luxon";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from "recharts";

const DashboardOverview: React.FC = () => {
  const [startDate, setStartDate] = useState<DateTime | null>(null);
  const [endDate, setEndDate] = useState<DateTime | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    metrics: {
      totalTransactions: 0,
      totalRevenue: 0,
      totalUsers: 0,
      totalWalletBalance: 0,
      profit: 0,
      totalGigSold: 0,
      activeUsers: 0,
      inactiveUsers: 0,
      newUsers: 0,
    },
    pieData: {},
    barData: {},
    dailyLogins: [],
  });

  const handleFilterApply = async () => {
    if (startDate && endDate) {
      setLoading(true);
      try {
        const response = await axios.get("/api/filteredData", {
          params: {
            startDate: startDate.toISO(),
            endDate: endDate.toISO(),
          },
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Prepare Pie Chart Data for Recharts
  const pieChartData = Object.entries(data.pieData).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ["#1976d2", "#2e7d32", "#f57c00", "#d32f2f"];

  // Prepare Bar Chart Data for Recharts
  const barChartData = Object.entries(data.barData).map(([month, count]) => ({
    month: `Month ${+month + 1}`,
    count,
  }));

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>

      {/* Date Range Picker */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          alignItems: "center",
        }}
      >
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
          />
        </LocalizationProvider>
        <Button
          variant="contained"
          color="primary"
          onClick={handleFilterApply}
          disabled={!startDate || !endDate}
        >
          Apply Filter
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {/* Metrics */}
          <Grid container spacing={2}>
            {[
              {
                label: "Total Transactions",
                value: data.metrics.totalTransactions,
              },
              {
                label: "Total Revenue (₦)",
                value: data.metrics.totalRevenue.toLocaleString(),
              },
              { label: "Total Users", value: data.metrics.totalUsers },
              {
                label: "Total Wallet Balance (₦)",
                value: data.metrics.totalWalletBalance.toLocaleString(),
              },
              {
                label: "Profit (₦)",
                value: data.metrics.profit.toLocaleString(),
              },
              { label: "Total Gig Sold", value: data.metrics.totalGigSold },
              { label: "Active Users", value: data.metrics.activeUsers },
              { label: "Inactive Users", value: data.metrics.inactiveUsers },
              { label: "New Users", value: data.metrics.newUsers },
            ].map((metric, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{metric.label}</Typography>
                    <Typography variant="h4">{metric.value}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Charts */}
          <Grid container spacing={2} sx={{ mt: 4 }}>
            {/* Pie Chart */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Revenue Contribution</Typography>
                  <PieChart width={300} height={250}>
                    <Pie
                      data={pieChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </CardContent>
              </Card>
            </Grid>

            {/* Bar Chart */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Transactions by Month</Typography>
                  <BarChart width={300} height={250} data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#1976d2" />
                  </BarChart>
                </CardContent>
              </Card>
            </Grid>

            {/* Line Chart */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Daily Logins</Typography>
                  <LineChart
                    width={Math.min(800, window.innerWidth - 40)}
                    height={250}
                    data={data.dailyLogins}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="logins" stroke="#1976d2" />
                  </LineChart>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default DashboardOverview;
