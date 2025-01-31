import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Snackbar, Alert,
  TableContainer
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AirtimeForm from './airtimeform';

interface IAirtimePlan {
  _id?: string;
  network: string;
  airtimeType: string;
  smartEarnerPercent: number;
  affiliatePercent: number;
  topUserPercent: number;
  apiPercent: number;
  shareAndSellPercent: number;
  shareAndSellApiPercent: number;
  shareAndSellAffiliatePercent: number;
  shareAndSellTopUserPercent: number;
  available: boolean;
}

const AirtimePage: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPlan, setSelectedPlan] = useState<IAirtimePlan | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [plans, setPlans] = useState<IAirtimePlan[]>([]);
   const [isAddPlan, setIsAddPlan] = useState(false);
  const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error" | "warning" | "info",
  });
  

  useEffect(() => {
    // Fetch initial data from the database
    const fetchPlans = async () => {
      try {
        const response = await axios.get('/api/airtime');
        setPlans(response.data.data); // Assuming response contains a "data" field with plans
      } catch (error) {
        console.error('Error fetching airtime plans:', error);
        setSnackbar({
        open: true,
        message: 'Failed to fetch airtime plans. Please try again.',
        severity: 'error',
      });
      }
    };

    fetchPlans();
  }, []);

  // Open the menu for a specific plan
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, plan: IAirtimePlan) => {
    setAnchorEl(event.currentTarget);
    setSelectedPlan(plan);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPlan(null);
  };

  // Open the form for creating or editing a plan
  

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedPlan(null);
  };

  const handleFormSubmit = async (form: IAirtimePlan) => {
    try {
      if (selectedPlan) {
        // Update the existing plan
        await axios.put(`/api/airtime?id=${selectedPlan._id}`, form);
        setPlans((prev) => prev.map((p) => (p._id === selectedPlan._id ? form : p)));
      } else {
        // Create a new plan
        const response = await axios.post('/api/airtime', form);
        setPlans((prev) => [...prev, response.data.data]); // Assuming response contains a "data" field
      }
      handleFormClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

   const handleEdit = async (_id: string) => {
    try {
      const response = await axios.get(`/api/airtime?id=${_id}`);
      setSelectedPlan(response.data);
      setIsFormOpen(true); // Open the form after fetching the plan details
    setIsAddPlan(false)
    } catch (error) {
      console.error('Error fetching plan:', error);
    }
  };

  const handleFormOpen = (plan?: IAirtimePlan) => {
    if (plan && plan._id) {
      handleEdit(plan._id); // Fetch and open the form for editing
    } else {
      setSelectedPlan(null);
      setIsAddPlan(true)
      setIsFormOpen(true); // Open the form for adding a new plan
    }
  };

  const handleDelete = async (plan: IAirtimePlan) => {
    try {
      console.log(plan)
      await axios.delete(`/api/airtime?id=${plan._id}`);
      setPlans((prev) => prev.filter((p) => p._id !== plan._id));
    setSnackbar({
        open: true,
        message: 'Plan deleted successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error deleting plan:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete plan. Please try again.',
        severity: 'error',
      });
    }
  };
   const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") return;
       setSnackbar({ ...snackbar, open: false });
    };

  return (
    <div className="p-4 shadow rounded-md container mx-auto h-screen flex flex-col">
      <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                  >
                    <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled">
                      {snackbar.message}
                    </Alert>
                  </Snackbar>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleFormOpen()}
        style={{ marginBottom: '16px' }}
      >
        Add Airtime Plan
      </Button>
<TableContainer sx={{ maxHeight: "100vh", overflow: 'auto', }}>
              <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Network</TableCell>
            <TableCell>Airtime Type</TableCell>
            <TableCell>Smart Earner Percent</TableCell>
            <TableCell>Affiliate Percent</TableCell>
            <TableCell>Top User Percent</TableCell>
            <TableCell>Available</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {plans.map((plan, index) => (
            <TableRow key={plan._id}>
              <TableCell>{plan.network}</TableCell>
              <TableCell>{plan.airtimeType}</TableCell>
              <TableCell>{plan.smartEarnerPercent || plan.shareAndSellPercent}</TableCell>
              <TableCell>{plan.affiliatePercent || plan.shareAndSellAffiliatePercent}</TableCell>
              <TableCell>{plan.topUserPercent || plan.shareAndSellTopUserPercent}</TableCell>
              <TableCell>{plan.available ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <IconButton onClick={(e) => handleMenuClick(e, plan)}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl) && selectedPlan === plan}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => { handleFormOpen(plan); handleMenuClose(); }}>Edit</MenuItem>
                  <MenuItem onClick={() => { handleDelete(plan); handleMenuClose(); }}>Delete</MenuItem>
                </Menu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </TableContainer>

      {isFormOpen && (
        <AirtimeForm
          initialPlan={selectedPlan ?? undefined}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
          isAddPlan={isAddPlan}
        />
      )}
    </div>
  );
};

export default AirtimePage;