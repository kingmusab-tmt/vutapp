import React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  // Avatar,
  // IconButton,
  // Tabs,
  // Tab,
  // Switch,
  Grid,
} from "@mui/material";

const StockVending: React.FC = () => {
  const [companyPrice, setCompanyPrice] = React.useState(1000); // Mock value
  const [sellingPrice, setSellingPrice] = React.useState(0);

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSellingPrice(Number(event.target.value));
  };

  const calculateProfit = () => {
     setCompanyPrice(1000); // Mock value
    return sellingPrice > companyPrice
   
      ? (sellingPrice - companyPrice) * 30 // Assume 30 items sold monthly
      : 0;
    
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Stock Vending
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Company Price"
            value={`₦${companyPrice}`}
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Your Selling Price"
            type="number"
            onChange={handlePriceChange}
          />
        </Grid>
      </Grid>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Monthly Profit: <strong>₦{calculateProfit()}</strong>
      </Typography>
      <Button variant="contained" color="primary" sx={{ mt: 2 }}>
        Save
      </Button>
    </Box>
  );
};
export default StockVending;