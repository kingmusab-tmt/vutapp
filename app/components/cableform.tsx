// // components/CableForm.tsx
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   TextField,
//   Button,
//   MenuItem,
//   Typography,
// } from "@mui/material";

// interface ICableFormProps {
//   onSubmit: (form: ICableSubscription) => void;
//   onCancel: () => void;
//   initialData?: ICableSubscription | null;
// }

// interface ICableSubscription {
//   cableName: string;
//   planAmount: number;
//   productCode: string;
//   package: string;
//   available: boolean;
// }

// const cableOptions = ["GOTV", "DSTV", "Startime"];

// const CableForm: React.FC<ICableFormProps> = ({
//   onSubmit,
//   onCancel,
//   initialData,
// }) => {
//   const [form, setForm] = useState<ICableSubscription>({
//     cableName: "",
//     planAmount: 0,
//     productCode: "",
//     package: "",
//     available: true,
//   });

//   useEffect(() => {
//     if (initialData) {
//       setForm(initialData);
//     }
//   }, [initialData]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(form);
//   };

//   return (
//     <Box
//       component="form"
//       onSubmit={handleSubmit}
//       sx={{ display: "flex", flexDirection: "column", gap: 2, p: 3 }}
//     >
//       <Typography variant="h6">
//         {initialData ? "Edit Cable Plan" : "Add Cable Plan"}
//       </Typography>

//       {/* Cable Name Dropdown */}
//       <TextField
//         select
//         label="Cable Name"
//         name="cableName"
//         value={form.cableName}
//         onChange={handleChange}
//         required
//       >
//         {cableOptions.map((option) => (
//           <MenuItem key={option} value={option}>
//             {option}
//           </MenuItem>
//         ))}
//       </TextField>

//       <TextField
//         label="Plan Amount"
//         name="planAmount"
//         type="number"
//         value={form.planAmount}
//         onChange={handleChange}
//         required
//       />

//       <TextField
//         label="Product Code"
//         name="productCode"
//         value={form.productCode}
//         onChange={handleChange}
//         required
//       />

//       <TextField
//         label="Package"
//         name="package"
//         value={form.package}
//         onChange={handleChange}
//         required
//       />

//       <Box display="flex" justifyContent="space-between">
//         <Button type="submit" variant="contained" color="primary">
//           {initialData ? "Update" : "Create"}
//         </Button>
//         <Button onClick={onCancel} variant="outlined" color="secondary">
//           Cancel
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default CableForm;
// components/cableform.tsx
import React, { useState, useEffect } from "react";
import { Box, TextField, Button, MenuItem, Typography } from "@mui/material";

interface ICableFormProps {
  onSubmit: (form: ICableSubscription) => void;
  onCancel: () => void;
  initialData?: ICableSubscription | null;
}

interface ICableSubscription {
  cableName: string;
  planAmount: number;
  productCode: string;
  package: string;
  available: boolean;
}

const cableOptions = ["GOTV", "DSTV", "Startime"];

const CableForm: React.FC<ICableFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [form, setForm] = useState<ICableSubscription>({
    cableName: "",
    planAmount: 0,
    productCode: "",
    package: "",
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
        label="Cable Name"
        name="cableName"
        value={form.cableName}
        onChange={handleChange}
        required
      >
        {cableOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Plan Amount"
        name="planAmount"
        type="number"
        value={form.planAmount}
        onChange={handleChange}
        required
      />

      <TextField
        label="Product Code"
        name="productCode"
        value={form.productCode}
        onChange={handleChange}
        required
      />

      <TextField
        label="Package"
        name="package"
        value={form.package}
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

export default CableForm;
