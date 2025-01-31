// import React, { useState } from "react";
// import { Box, Button, TextField, Typography, IconButton, InputAdornment } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import axios from "axios";



// const SetupTransactionPin: React.FC = () => {
//   const [pin, setPin] = useState("");
//   const [confirmPin, setConfirmPin] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [showPin, setShowPin] = useState(false);
//   const [showConfirmPin, setShowConfirmPin] = useState(false);

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     setError("");
//     setSuccess("");

//     const pinRegex = /^\d{5}$/;
//     if (!pinRegex.test(pin)) {
//       setError("PIN must be exactly 5 digits");
//       return;
//     }

//     if (pin !== confirmPin) {
//       setError("Pins do not match");
//       return;
//     }

//     try {
//       await axios.post("/api/users/setTransactionPin", { pin });
//       setSuccess("Transaction PIN set successfully");
//     } catch (err) {
//       setError("Failed to set transaction PIN");
//     }
//   };

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         maxWidth: 400,
//         mx: "auto",
//         p: 3,
//         bgcolor: "background.paper",
//         borderRadius: 2,
//         boxShadow: 3,
//       }}
//     >
//       <Typography variant="h6" textAlign="center" gutterBottom>
//         Set Up Transaction PIN
//       </Typography>
//       <form onSubmit={handleSubmit}>
//         <TextField
//           fullWidth
//           label="New PIN"
//           type={showPin ? "text" : "password"}
//           variant="outlined"
//           margin="normal"
//           value={pin}
//           onChange={(e) => {
//             if (/^\d{0,5}$/.test(e.target.value)) setPin(e.target.value);
//           }}
//           required
//           inputProps={{ maxLength: 5 }}
//           InputProps={{
//             endAdornment: (
//               <InputAdornment position="end">
//                 <IconButton onClick={() => setShowPin((prev) => !prev)}>
//                   {showPin ? <VisibilityOff /> : <Visibility />}
//                 </IconButton>
//               </InputAdornment>
//             ),
//           }}
//         />
//         <TextField
//           fullWidth
//           label="Confirm PIN"
//           type={showConfirmPin ? "text" : "password"}
//           variant="outlined"
//           margin="normal"
//           value={confirmPin}
//           onChange={(e) => {
//             if (/^\d{0,5}$/.test(e.target.value)) setConfirmPin(e.target.value);
//           }}
//           required
//           inputProps={{ maxLength: 5 }}
//           InputProps={{
//             endAdornment: (
//               <InputAdornment position="end">
//                 <IconButton onClick={() => setShowConfirmPin((prev) => !prev)}>
//                   {showConfirmPin ? <VisibilityOff /> : <Visibility />}
//                 </IconButton>
//               </InputAdornment>
//             ),
//           }}
//         />
//         {error && (
//           <Typography color="error" textAlign="center" mt={1}>
//             {error}
//           </Typography>
//         )}
//         {success && (
//           <Typography color="success.main" textAlign="center" mt={1}>
//             {success}
//           </Typography>
//         )}
//         <Button fullWidth variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
//           Submit
//         </Button>
//       </form>
//     </Box>
//   );
// };

// export default SetupTransactionPin;
// import React, { useState, useEffect } from "react";
// import { 
//   Box, Button, TextField, Typography, IconButton, InputAdornment, 
//   Snackbar, Alert, CircularProgress 
// } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import axios from "axios";

// interface SetupTransactionPinProps {
//   handleCloseModal: () => void;
// }

// const SetupTransactionPin: React.FC<SetupTransactionPinProps> = ({ handleCloseModal }) => {
//   const [pin, setPin] = useState("");
//   const [confirmPin, setConfirmPin] = useState("");
//   const [showPin, setShowPin] = useState(false);
//   const [showConfirmPin, setShowConfirmPin] = useState(false);
//   const [pinExists, setPinExists] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<{ text: string; type: "success" | "error" }>({ text: "", type: "success" });
//   const [snackbarOpen, setSnackbarOpen] = useState(false);

//   // Check if the user already has a transaction PIN
//   useEffect(() => {
//     const checkTransactionPin = async () => {
//       try {
//         const response = await axios.get("/api/users/checkTransactionPin");
//         setPinExists(response.data.hasTransactionPin);
//       } catch (error) {
//         console.error("Error checking transaction PIN", error);
//       }
//     };
//     checkTransactionPin();
//   }, []);

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     setMessage({ text: "", type: "success" });

//     const pinRegex = /^\d{5}$/;
//     if (!pinRegex.test(pin)) {
//       setMessage({ text: "PIN must be exactly 5 digits", type: "error" });
//       setSnackbarOpen(true);
//       return;
//     }

//     if (pin !== confirmPin) {
//       setMessage({ text: "Pins do not match", type: "error" });
//       setSnackbarOpen(true);
//       return;
//     }

//     setLoading(true);
//     try {
//       await axios.post("/api/users/setTransactionPin", { pin });
//       setMessage({ text: "Transaction PIN set successfully!", type: "success" });
//       setSnackbarOpen(true);
//       setTimeout(() => handleCloseModal(), 2000); // Close modal after success
//     } catch (err) {
//       setMessage({ text: "Failed to set transaction PIN", type: "error" });
//       setSnackbarOpen(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         maxWidth: 400,
//         mx: "auto",
//         p: 3,
//         bgcolor: "background.paper",
//         borderRadius: 2,
//         boxShadow: 3,
//         textAlign: "center"
//       }}
//     >
//       <Typography variant="h6" gutterBottom>
//         {pinExists ? "Change Transaction PIN" : "Set Up Transaction PIN"}
//       </Typography>
      
//       <form onSubmit={handleSubmit}>
//         <TextField
//           fullWidth
//           label="New PIN"
//           type={showPin ? "text" : "password"}
//           variant="outlined"
//           margin="normal"
//           value={pin}
//           onChange={(e) => {
//             if (/^\d{0,5}$/.test(e.target.value)) setPin(e.target.value);
//           }}
//           required
//           inputProps={{ maxLength: 5 }}
//           InputProps={{
//             endAdornment: (
//               <InputAdornment position="end">
//                 <IconButton onClick={() => setShowPin((prev) => !prev)}>
//                   {showPin ? <VisibilityOff /> : <Visibility />}
//                 </IconButton>
//               </InputAdornment>
//             ),
//           }}
//         />
//         <TextField
//           fullWidth
//           label="Confirm PIN"
//           type={showConfirmPin ? "text" : "password"}
//           variant="outlined"
//           margin="normal"
//           value={confirmPin}
//           onChange={(e) => {
//             if (/^\d{0,5}$/.test(e.target.value)) setConfirmPin(e.target.value);
//           }}
//           required
//           inputProps={{ maxLength: 5 }}
//           InputProps={{
//             endAdornment: (
//               <InputAdornment position="end">
//                 <IconButton onClick={() => setShowConfirmPin((prev) => !prev)}>
//                   {showConfirmPin ? <VisibilityOff /> : <Visibility />}
//                 </IconButton>
//               </InputAdornment>
//             ),
//           }}
//         />
        
//         <Button 
//           fullWidth 
//           variant="contained" 
//           color="primary" 
//           type="submit" 
//           sx={{ mt: 2 }} 
//           disabled={loading}
//         >
//           {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
//         </Button>
//       </form>

//       {/* Snackbar for messages */}
//       <Snackbar 
//         open={snackbarOpen} 
//         autoHideDuration={4000} 
//         onClose={() => setSnackbarOpen(false)}
//       >
//         <Alert onClose={() => setSnackbarOpen(false)} severity={message.type as "success" | "error"} sx={{ width: '100%' }}>
//           {message.text}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default SetupTransactionPin;
import React, { useState, useEffect } from "react";
import { 
  Box, Button, TextField, Typography, IconButton, InputAdornment, 
  Snackbar, Alert, CircularProgress 
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";

interface SetupTransactionPinProps {
  handleCloseModal: () => void;
}

const SetupTransactionPin: React.FC<SetupTransactionPinProps> = ({ handleCloseModal }) => {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [pinExists, setPinExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" }>({ text: "", type: "success" });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [forgotPinPrompt, setForgotPinPrompt] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  // Check if the user already has a transaction PIN
  useEffect(() => {
    const checkTransactionPin = async () => {
      try {
        const response = await axios.get("/api/users/transactionpin");
        setPinExists(response.data);
      } catch (error) {
        console.error("Error checking transaction PIN", error);
      }
    };
    checkTransactionPin();
  }, []);

  useEffect(() => {
    if (resetMessage) {
      setForgotPinPrompt(true);
    }
  }, [resetMessage]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage({ text: "", type: "success" });

    const pinRegex = /^\d{5}$/;
    if (!pinRegex.test(pin)) {
      setMessage({ text: "PIN must be exactly 5 digits", type: "error" });
      setSnackbarOpen(true);
      return;
    }

    if (pin !== confirmPin) {
      setMessage({ text: "Pins do not match", type: "error" });
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/users/transactionpin", { pin });
      setMessage({ text: "Transaction PIN set successfully!", type: "success" });
      setSnackbarOpen(true);
      setTimeout(() => handleCloseModal(), 2000); // Close modal after success
    } catch (err) {
      setMessage({ text: "Failed to set transaction PIN", type: "error" });
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 400,
        mx: "auto",
        p: 3,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 3,
        textAlign: "center"
      }}
    >
      <Typography variant="h6" gutterBottom>
        {pinExists ? "Change Transaction PIN" : "Set Up Transaction PIN"}
      </Typography>

      {pinExists ? (
        forgotPinPrompt ? (
          <React.Fragment>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {resetMessage}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              onClick={handleCloseModal}
            >
              Dismiss
            </Button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography variant="body1" sx={{ mb: 2 }}>
              You already have a transaction PIN. Did you forget your PIN?
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mr: 2 }} 
              onClick={() => setResetMessage("Check your email for PIN reset code.")}
            >
              Yes
            </Button>
            <Button 
              color="primary" 
              onClick={() => setResetMessage("You have an existing PIN, kindly use it.")}
            >
              No
            </Button>
            {resetMessage && <Typography variant="body1" sx={{ mt: 2 }}>{resetMessage}</Typography>}
          </React.Fragment>
        )
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="New PIN"
            type={showPin ? "text" : "password"}
            variant="outlined"
            margin="normal"
            value={pin}
            onChange={(e) => {
              if (/^\d{0,5}$/.test(e.target.value)) setPin(e.target.value);
            }}
            required
            inputProps={{ maxLength: 5 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPin((prev) => !prev)}>
                    {showPin ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Confirm PIN"
            type={showConfirmPin ? "text" : "password"}
            variant="outlined"
            margin="normal"
            value={confirmPin}
            onChange={(e) => {
              if (/^\d{0,5}$/.test(e.target.value)) setConfirmPin(e.target.value);
            }}
            required
            inputProps={{ maxLength: 5 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPin((prev) => !prev)}>
                    {showConfirmPin ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <Button 
            fullWidth 
            variant="contained" 
            color="primary" 
            type="submit" 
            sx={{ mt: 2 }} 
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
          </Button>
        </form>
      )}

      {/* Snackbar for messages */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={4000} 
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={message.type as "success" | "error"} sx={{ width: '100%' }}>
          {message.text}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SetupTransactionPin;
