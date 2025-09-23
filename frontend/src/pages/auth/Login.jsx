import React, { useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import LoginForm from "../../components/forms/full_forms/LoginForm";
import AxiosInstance from "../../components/AxiosInstance";

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleCloseError = () => setError(null);

  const submission = async (data) => {
    // Login with simplejwt default endpoint
    setIsSubmitting(true);
    setError(null);
    console.log("Form data submitted:", data);
    await AxiosInstance.post("api/token/", {
      username: data.username_or_email,
      password: data.password,
    })
      .then((res) => {
        // Store tokens in localStorage
        localStorage.setItem("Token", res.data.access);
        localStorage.setItem("RefreshToken", res.data.refresh);
        window.location.href = "/"; // Redirect to home page after login
      })
      .catch((err) => {
        const errorData = err.response?.data;
        let errorMessage;
        if (errorData) {
          // Get the first error message from any field
          const firstErrorField = Object.values(errorData)[0];
          errorMessage = firstErrorField || "Unexpected error occurred during login.";
        } else {
          errorMessage = "Unexpected error occurred while login.";
        }
        setError(errorMessage);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div>
      <LoginForm submission={submission} isSubmitting={isSubmitting}/>
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
    </div>
  );
}
