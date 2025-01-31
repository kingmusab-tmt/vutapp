// "use client";

// import React, { useState } from "react";
// import { useSession } from "next-auth/react";
// import axios from "axios";
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   CircularProgress,
//   Grid,
//   Container,
//   Paper,
// } from "@mui/material";
// import { useForm, Controller } from "react-hook-form";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";

// // Define validation schema
// const schema = yup.object().shape({
//   nin: yup.string().required("NIN is required").length(11, "NIN must be 11 digits"),
//   bvn: yup.string().required("BVN is required").length(11, "BVN must be 11 digits"),
//   firstName: yup.string().required("First Name is required"),
//   middleName: yup.string(),
//   lastName: yup.string(),
//   dateOfBirth: yup.string().required("Date of Birth is required"),
//   gender: yup.string().required("Gender is required"),
//   mobileNumber: yup.string().required("Phone Number is required"),
// });

// interface KycFormProps {
//   handleCloseModal: () => void;
// }

// const KycForm: React.FC<KycFormProps> = ({ handleCloseModal }) => {
//   const { data: session } = useSession();
//   const [loading, setLoading] = useState(false);
//   const [kycData, setKycData] = useState<any | null>(null);

//   const {
//     control,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       nin: "",
//       bvn: "",
//       firstName: "",
//       middleName: "",
//       lastName: "",
//       dateOfBirth: "",
//       gender: "",
//       mobileNumber: "",
//     },
//   });

//   // Watch the NIN value
//   const ninValue = watch("nin");

//   const handleNinVerification = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.post("/api/verifynin", { nin: ninValue });
//       console.log(response);

//       if (response.data.requestSuccessful) {
//         const { firstName, middleName, lastName, dateOfBirth, gender, mobileNumber } = response.data.responseBody;
//         setKycData(response.data.responseBody);

//         // Populate the form fields with received data
//         setValue("firstName", firstName);
//         setValue("middleName", middleName);
//         setValue("lastName", lastName);
//         setValue("dateOfBirth", dateOfBirth);
//         setValue("gender", gender);
//         setValue("mobileNumber", mobileNumber);
//       } else {
//         alert("NIN verification failed. Please check your details.");
//       }
//     } catch (error) {
//       console.error("Error verifying NIN:", error);
//       alert("Error verifying NIN. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onSubmit = async (data: any) => {
//     try {
//       await axios.put("/api/users/updateuser", data);
//       alert("KYC details updated successfully!");
//       handleCloseModal();
//     } catch (error) {
//       console.error("Error updating KYC details:", error);
//       alert("Failed to update KYC details.");
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
//         <Typography variant="h5" gutterBottom>
//           Welcome, {session?.user?.name || "User"}! Complete your KYC
//         </Typography>

//         <form onSubmit={handleSubmit(onSubmit)}>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <Controller
//                 name="nin"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField {...field} fullWidth label="NIN Number" error={!!errors.nin} helperText={errors.nin?.message} />
//                 )}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <Controller
//                 name="bvn"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField {...field} fullWidth label="BVN Number" error={!!errors.bvn} helperText={errors.bvn?.message} />
//                 )}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Button variant="contained" color="primary" fullWidth onClick={handleNinVerification} disabled={loading}>
//                 {loading ? <CircularProgress size={24} /> : "Verify NIN"}
//               </Button>
//             </Grid>

//             {kycData && (
//               <>
//                 <Grid item xs={12}>
//                   <Controller
//                     name="firstName"
//                     control={control}
//                     render={({ field }) => (
//                       <TextField {...field} fullWidth label="First Name" error={!!errors.firstName} helperText={errors.firstName?.message} />
//                     )}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Controller
//                     name="middleName"
//                     control={control}
//                     render={({ field }) => (
//                       <TextField {...field} fullWidth label="Middle Name" error={!!errors.middleName} helperText={errors.middleName?.message} />
//                     )}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Controller
//                     name="lastName"
//                     control={control}
//                     render={({ field }) => (
//                       <TextField {...field} fullWidth label="Last Name" error={!!errors.lastName} helperText={errors.lastName?.message} />
//                     )}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Controller
//                     name="dateOfBirth"
//                     control={control}
//                     render={({ field }) => (
//                       <TextField {...field} fullWidth label="Date of Birth" error={!!errors.dateOfBirth} helperText={errors.dateOfBirth?.message} />
//                     )}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Controller
//                     name="gender"
//                     control={control}
//                     render={({ field }) => (
//                       <TextField {...field} fullWidth label="Gender" error={!!errors.gender} helperText={errors.gender?.message} />
//                     )}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Controller
//                     name="mobileNumber"
//                     control={control}
//                     render={({ field }) => (
//                       <TextField {...field} fullWidth label="Phone Number" error={!!errors.mobileNumber} helperText={errors.mobileNumber?.message} />
//                     )}
//                   />
//                 </Grid>

//                 <Grid item xs={12}>
//                   <Button variant="contained" color="primary" fullWidth type="submit">
//                     Submit KYC
//                   </Button>
//                 </Grid>
//               </>
//             )}
//           </Grid>
//         </form>
//       </Paper>
//     </Container>
//   );
// };

// export default KycForm;
// "use client";

// import React, { useState } from "react";
// import { useSession } from "next-auth/react";
// import axios from "axios";
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   CircularProgress,
//   Grid,
//   Container,
//   Paper,
// } from "@mui/material";
// import { useForm, Controller } from "react-hook-form";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";

// const schema = yup.object().shape({
//   nin: yup.string().required("NIN is required").length(11, "NIN must be 11 digits"),
//   bvn: yup.string().required("BVN is required").length(11, "BVN must be 11 digits"),
// });

// interface KycFormProps {
//   handleCloseModal: () => void;
// }

// const KycForm: React.FC<KycFormProps> = ({ handleCloseModal }) => {
//   const { data: session } = useSession();
//   const [loading, setLoading] = useState(false);
//   const [verificationMessage, setVerificationMessage] = useState("");
//   const [verified, setVerified] = useState(false);

//   const {
//     control,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       nin: "",
//       bvn: "",
//     },
//   });

//   const ninValue = watch("nin");

//   const handleNinVerification = async () => {
//     setLoading(true);
//     setVerificationMessage("");
//     try {
//       const response = await axios.post("/api/verifynin", { nin: ninValue });
//       if (response.data.requestSuccessful) {
//         setVerified(true);
//         setVerificationMessage("Information Verified");
//       } else {
//         setVerified(false);
//         setVerificationMessage("Invalid NIN or BVN");
//       }
//     } catch (error) {
//       console.error("Error verifying NIN:", error);
//       setVerificationMessage("Error verifying NIN. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onSubmit = async (data: any) => {
//     try {
//       await axios.put("/api/users/updateuser", data);
//       alert("KYC details updated successfully!");
//       handleCloseModal();
//     } catch (error) {
//       console.error("Error updating KYC details:", error);
//       alert("Failed to update KYC details.");
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
//         <Typography variant="h5" gutterBottom>
//           Welcome, {session?.user?.name || "User"}! Complete your KYC
//         </Typography>

//         <form onSubmit={handleSubmit(onSubmit)}>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <Controller
//                 name="nin"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField {...field} fullWidth label="NIN Number" error={!!errors.nin} helperText={errors.nin?.message} />
//                 )}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <Controller
//                 name="bvn"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField {...field} fullWidth label="BVN Number" error={!!errors.bvn} helperText={errors.bvn?.message} />
//                 )}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 fullWidth
//                 onClick={verified ? handleSubmit(onSubmit) : handleNinVerification}
//                 disabled={loading}
//               >
//                 {loading ? <CircularProgress size={24} /> : verified ? "Submit KYC" : "Verify NIN"}
//               </Button>
//             </Grid>
//             {verificationMessage && (
//               <Grid item xs={12}>
//                 <Typography variant="body1" color={verified ? "green" : "red"}>
//                   {verificationMessage}
//                 </Typography>
//               </Grid>
//             )}
//           </Grid>
//         </form>
//       </Paper>
//     </Container>
//   );
// };

// export default KycForm;
"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Grid,
  Container,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  nin: yup.string().required("NIN is required").length(11, "NIN must be 11 digits"),
  bvn: yup.string().required("BVN is required").length(11, "BVN must be 11 digits"),
});

interface KycFormProps {
  handleCloseModal: () => void;
}

const KycForm: React.FC<KycFormProps> = ({ handleCloseModal }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nin: "",
      bvn: "",
    },
  });

  const ninValue = watch("nin");

  const handleNinVerification = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/verifynin", { nin: ninValue });
      if (response.data.requestSuccessful) {
        setVerified(true);
        setSnackbarMessage("Information Verified");
        setSnackbarSeverity("success");
      } else {
        setVerified(false);
        setSnackbarMessage("Invalid NIN or BVN");
        setSnackbarSeverity("error");
      }
    } catch (error) {
      console.error("Error verifying NIN:", error);
      setSnackbarMessage("Error verifying NIN. Please try again later.");
      setSnackbarSeverity("error");
    } finally {
      setLoading(false);
      setOpenSnackbar(true);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      await axios.put("/api/users/updateuser", data);
      setSnackbarMessage("KYC details updated successfully!");
      setSnackbarSeverity("success");
      handleCloseModal();
    } catch (error) {
      console.error("Error updating KYC details:", error);
      setSnackbarMessage("Failed to update KYC details.");
      setSnackbarSeverity("error");
    } finally {
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Welcome, {session?.user?.name || "User"}! Complete your KYC
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="nin"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth label="NIN Number" error={!!errors.nin} helperText={errors.nin?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="bvn"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth label="BVN Number" error={!!errors.bvn} helperText={errors.bvn?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={verified ? handleSubmit(onSubmit) : handleNinVerification}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : verified ? "Submit KYC" : "Verify NIN"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default KycForm;