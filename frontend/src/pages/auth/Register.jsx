import { useState, useEffect } from "react";
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import RegisterForm from "../../components/forms/full_forms/RegisterForm";
import AxiosInstance from "../../components/AxiosInstance";


export default function Register() {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCloseError = () => {
    setError(null);
  }
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    window.location.href = "/login";
  };

  const submission = (data) => {
    setIsSubmitting(true);
    setError(null);
    console.log("Form data submitted:", data);
    AxiosInstance.post("register/", {
      username: data.username,
      email: data.email,
      password: data.password,
    }).then(() => {
      setShowSuccess(true);
    }).catch((err) => {
      console.error("Error registering user:", err.response?.data || err);
      
      const errorData = err.response?.data;
      let errorMessage;

      if (errorData) {
        // Get the first error message from any field
        const firstErrorField = Object.values(errorData)[0];
        errorMessage = Array.isArray(firstErrorField) ? firstErrorField[0] : "Unexpected error occurred.";
      } else {
        errorMessage = "Unexpected error occurred while registering.";
      }
      setError(errorMessage);
    }).finally(() => {
      setIsSubmitting(false);
    })
  }

  return (
    <div>
      <RegisterForm submission={submission} isSubmitting={isSubmitting} />
      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          sx={{ width: "100%" }}
        >
          Registration successful! You can now log in.
        </Alert>
      </Snackbar>
    </div>
  );
}