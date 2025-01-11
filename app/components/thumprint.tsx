import React from "react";
import {
  Box,
  // Button,
  // TextField,
  Typography,
  // Avatar,
  // IconButton,
  // Tabs,
  // Tab,
  Switch,
  // Grid,
} from "@mui/material";

const EnableThumbprint: React.FC = () => {
  const [enabled, setEnabled] = React.useState(false);

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Enable Thumbprint
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography>Enable Thumbprint Authentication</Typography>
        <Switch
          checked={enabled}
          onChange={() => setEnabled((prev) => !prev)}
          color="primary"
          sx={{ ml: 2 }}
        />
      </Box>
    </Box>
  );
};
export default EnableThumbprint;
