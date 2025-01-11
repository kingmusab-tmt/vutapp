import React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  IconButton,
  Tabs,
  Tab,
  Switch,
  Grid,
} from "@mui/material";

const ChangePassword: React.FC = () => {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Change Password
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth label="Current Password" type="password" />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="New Password" type="password" />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Confirm New Password" type="password" />
        </Grid>
      </Grid>
      <Button variant="contained" color="primary" sx={{ mt: 2 }}>
        Update Password
      </Button>
    </Box>
  );
};
export default ChangePassword;