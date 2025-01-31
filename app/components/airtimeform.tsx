import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  SelectChangeEvent,
} from '@mui/material';

interface IAirtimePlan {
  _id?: string; // Made optional for new plans
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

const networks = ['MTN', 'Airtel', '9mobile', 'Glo'];
const airtimeTypes = ['VTU', 'ShareAndSell'];

const AirtimeForm: React.FC<{
  initialPlan?: IAirtimePlan;
  onSubmit: (plan: IAirtimePlan) => void;
  onClose: () => void;
  isAddPlan: boolean;
}> = ({ initialPlan, onSubmit, onClose, isAddPlan }) => {
  
  const [form, setForm] = useState<IAirtimePlan>(
     {
      network: '',
      airtimeType: '',
      smartEarnerPercent: 0,
      affiliatePercent: 0,
      topUserPercent: 0,
      apiPercent: 0,
      shareAndSellPercent: 0,
      shareAndSellApiPercent: 0,
      shareAndSellAffiliatePercent: 0,
      shareAndSellTopUserPercent: 0,
      available: true,
    }
  );
  useEffect(() => {
    if (initialPlan) {

      console.log(`this is in form component ${initialPlan}`);
      setForm({
        network: initialPlan.network || networks[0], // Fallback to empty string if undefined
        airtimeType: initialPlan.airtimeType || airtimeTypes[0], // Fallback to empty string if undefined
        smartEarnerPercent: initialPlan.smartEarnerPercent || 0,
        affiliatePercent: initialPlan.affiliatePercent || 0,
        topUserPercent: initialPlan.topUserPercent || 0,
        apiPercent: initialPlan.apiPercent || 0,
        shareAndSellPercent: initialPlan.shareAndSellPercent || 0,
        shareAndSellApiPercent: initialPlan.shareAndSellApiPercent || 0,
        shareAndSellAffiliatePercent: initialPlan.shareAndSellAffiliatePercent || 0,
        shareAndSellTopUserPercent: initialPlan.shareAndSellTopUserPercent || 0,
        available: initialPlan.available ?? true, // Default to true if undefined
      });
    }
  }, [initialPlan]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name as string]: value }));
  };

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialPlan ? 'Edit Airtime Plan' : 'Create Airtime Plan'}</DialogTitle>
      <DialogContent>
        {/* Network Selection */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Network</InputLabel>
          <Select
            name="network"
            value={form.network}
            onChange={(e) => handleChange(e as SelectChangeEvent<string>)}
          >
            {networks.map((network) => (
              <MenuItem key={network} value={network}>
                {network}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Airtime Type Selection */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Airtime Type</InputLabel>
          <Select
            name="airtimeType"
            value={form.airtimeType}
            onChange={(e) => handleChange(e as SelectChangeEvent<string>)}
          >
            {airtimeTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Conditional Fields for VTU */}
        {form.airtimeType === 'VTU' && (
          <>
            <TextField
              fullWidth
              name="smartEarnerPercent"
              label="Smart Earner Percent"
              type="number"
              value={form.smartEarnerPercent}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              name="affiliatePercent"
              label="Affiliate Percent"
              type="number"
              value={form.affiliatePercent}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              name="topUserPercent"
              label="Top User Percent"
              type="number"
              value={form.topUserPercent}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              name="apiPercent"
              label="API Percent"
              type="number"
              value={form.apiPercent}
              onChange={handleChange}
              margin="normal"
            />
          </>
        )}

        {/* Conditional Fields for Share and Sell */}
        {form.airtimeType === 'ShareAndSell' && (
          <>
            <TextField
              fullWidth
              name="shareAndSellPercent"
              label="Share And Sell Percent"
              type="number"
              value={form.shareAndSellPercent}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              name="shareAndSellApiPercent"
              label="Share And Sell API Percent"
              type="number"
              value={form.shareAndSellApiPercent}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              name="shareAndSellAffiliatePercent"
              label="Share And Sell Affiliate Percent"
              type="number"
              value={form.shareAndSellAffiliatePercent}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              name="shareAndSellTopUserPercent"
              label="Share And Sell Top User Percent"
              type="number"
              value={form.shareAndSellTopUserPercent}
              onChange={handleChange}
              margin="normal"
            />
          </>
        )}

        {/* Availability Toggle */}
        <FormControlLabel
          control={
            <Switch
              checked={form.available}
              name="available"
              onChange={handleToggle}
            />
          }
          label="Available"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSubmit(form)} variant="contained" color="primary">
           {isAddPlan ? "Save New Plan" : "Update Plan"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AirtimeForm;
