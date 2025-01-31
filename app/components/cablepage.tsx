// pages/cablepage.tsx
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
import CableForm from "./cableform";
import axios from "axios";

interface ICableSubscription {
  _id?: string;
  cableName: string;
  planAmount: number;
  productCode: string;
  package: string;
  available: boolean;
}

const CablePage: React.FC = () => {
  const [plans, setPlans] = useState<ICableSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<ICableSubscription | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get("/api/cableplans");
        setPlans(response.data);
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleCreateOrUpdate = async (form: ICableSubscription) => {
    try {
      if (selectedPlan) {
        // Update existing plan
        await axios.put(`/api/cableplans?id=${selectedPlan._id}`, form);
        setPlans((prev) =>
          prev.map((p) => (p._id === selectedPlan._id ? { ...form, _id: p._id } : p))
        );
        setSnackbar("Plan updated successfully!");
      } else {
        // Create new plan
        const response = await axios.post("/api/cableplans", form);
        setPlans((prev) => [...prev, response.data.plan]);
        setSnackbar("Plan created successfully!");
      }
      closeForm();
    } catch (error) {
      console.error("Error creating/updating plan:", error);
    }
  };

  const handleDelete = async (plan: ICableSubscription) => {
    try {
      await axios.delete(`/api/cableplans?id=${plan._id}`);
      setPlans((prev) => prev.filter((p) => p._id !== plan._id));
      setSnackbar("Plan deleted successfully!");
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
    setAnchorEl(null);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    plan: ICableSubscription
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedPlan(plan);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const openForm = (plan?: ICableSubscription) => {
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
        Cable Plans
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => openForm()}
        sx={{ mb: 2 }}
      >
        Add Cable Plan
      </Button>

      {loading ? (
        <CircularProgress />
        ) : (
            <TableContainer sx={{ maxHeight: "100vh", overflow: 'auto', }}>
              <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Cable Name</TableCell>
              <TableCell>Plan Amount</TableCell>
              <TableCell>Product Code</TableCell>
              <TableCell>Package</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan._id}>
                <TableCell>{plan.cableName}</TableCell>
                <TableCell>{plan.planAmount}</TableCell>
                <TableCell>{plan.productCode}</TableCell>
                <TableCell>{plan.package}</TableCell>
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
        <CableForm
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

export default CablePage;
