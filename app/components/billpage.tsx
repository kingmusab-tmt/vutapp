import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Snackbar,
  Menu,
  MenuItem,
  CircularProgress,
  Dialog,
  TableContainer,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BillForm from "./billform";
import axios from "axios";

interface IBillPayment {
  _id?: string;
   billerType: string;
  billerName: string;
  billerId: string;
  available: boolean;
}

const BillPage: React.FC = () => {
  const [plans, setPlans] = useState<IBillPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<IBillPayment | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get("/api/billpayment");
        setPlans(response.data);
      } catch (error) {
        console.error("Error fetching bill:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleCreateOrUpdate = async (form: IBillPayment) => {
    try {
      if (selectedPlan) {
        // Update existing plan
        await axios.put(`/api/billpayment?id=${selectedPlan._id}`, form);
        setPlans((prev) =>
          prev.map((p) => (p._id === selectedPlan._id ? { ...form, _id: p._id } : p))
        );
        setSnackbar("Bill updated successfully!");
      } else {
        // Create new plan
        const response = await axios.post("/api/billpayment", form);
        setPlans((prev) => [...prev, response.data.plan]);
        setSnackbar("Bill created successfully!");
      }
      closeForm();
    } catch (error) {
      console.error("Error creating/updating bill:", error);
    }
  };

  const handleDelete = async (plan: IBillPayment) => {
    try {
      await axios.delete(`/api/billpayment?id=${plan._id}`);
      setPlans((prev) => prev.filter((p) => p._id !== plan._id));
      setSnackbar("Bill deleted successfully!");
    } catch (error) {
      console.error("Error deleting bill:", error);
    }
    setAnchorEl(null);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    plan: IBillPayment
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedPlan(plan);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const openForm = (plan?: IBillPayment) => {
    setSelectedPlan(plan || null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setSelectedPlan(null);
    setIsFormOpen(false);
  };

  return (
    <div className="p-4 shadow rounded-md container mx-auto h-screen flex flex-col">
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Bill Payment
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => openForm()}
        sx={{ mb: 2 }}
      >
        Add Biller Details
      </Button>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer sx={{ maxHeight: "100vh", overflow: 'auto', }}>
              <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Biller Type</TableCell>
              <TableCell>Biller Name</TableCell>
              <TableCell>Biller ID</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan._id}>
                <TableCell>{plan.billerType}</TableCell>
                <TableCell>{plan.billerName}</TableCell>
                <TableCell>{plan.billerId}</TableCell>
                <TableCell>{plan.available ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleMenuClick(e, plan)}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl && selectedPlan === plan)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem
                      onClick={() => {
                        openForm(plan);
                        handleMenuClose();
                      }}
                    >
                      Edit
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleDelete(plan);
                        handleMenuClose();
                      }}
                    >
                      Delete
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
              </Table>
              </TableContainer>
      )}

      <Dialog open={isFormOpen} onClose={closeForm} fullWidth maxWidth="sm">
        <BillForm
          onSubmit={handleCreateOrUpdate}
          onCancel={closeForm}
          initialData={selectedPlan}
        />
      </Dialog>

      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={3000}
        onClose={() => setSnackbar(null)}
        message={snackbar}
      />
      </Box>
      </div>
  );
};

export default BillPage;
