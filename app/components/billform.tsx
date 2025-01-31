import React, { useState, useEffect } from "react";
import { Box, TextField, Button, MenuItem, Typography } from "@mui/material";

interface IBillFormProps {
  onSubmit: (form: IBillPayment) => void;
  onCancel: () => void;
  initialData?: IBillPayment | null;
}

interface IBillPayment {
 billerType: string;
  billerName: string;
  billerId: string;
  available: boolean;
}

const billOptions = ["Electricity", "Water"];

const BillForm: React.FC<IBillFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
    const [form, setForm] = useState<IBillPayment>({
      billerType: "",
  billerName: "",
  billerId: "",
  available: true,
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, p: 3 }}
    >
      <Typography variant="h6">
        {initialData ? "Edit Cable Plan" : "Add Cable Plan"}
      </Typography>

      <TextField
        select
        label="Bill Type"
        name="billerType"
        value={form.billerType}
        onChange={handleChange}
        required
      >
        {billOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Biller Name"
        name="billerName"
        value={form.billerName}
        onChange={handleChange}
        required
      />

      <TextField
        label="Biller Id"
        name="billerId"
        value={form.billerId}
        onChange={handleChange}
        required
      />

      <Box display="flex" justifyContent="space-between">
        <Button type="submit" variant="contained" color="primary">
          {initialData ? "Update" : "Create"}
        </Button>
        <Button onClick={onCancel} variant="outlined" color="secondary">
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default BillForm;
