import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import RegisterForm from "../../components/forms/full_forms/RegisterForm";
import AxiosInstance from "../../components/AxiosInstance";
import UserEmailForm from "../../components/forms/full_forms/PasswordResetRequestForm";
import ResetPasswordForm from "../../components/forms/full_forms/ResetPasswordForm";


export default function PasswordReset() {
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

  const {token} = useParams()

  const submission = (data) => {
    setIsSubmitting(true);
    setError(null);
    console.log("Form data submitted:", data);
    AxiosInstance.post('api/password_reset/confirm/', {
      password: data.new_password,
      token: token
    }).then((res) => {
      console.log("Password reset successfully:", res.data);
      setShowSuccess(true);
    })
      .catch((err) => {
        console.error("Error resetting password:", err.response?.data || err);
        
        const errorData = err.response?.data;
        let errorMessage;

        if (errorData) {
          // Get the first error message from any field
          errorMessage = Object.values(errorData)[0];
          
        } else {
          errorMessage = "Unexpected error occurred while resetting the password.";
        }

        setError(errorMessage);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <div>
      <ResetPasswordForm submission={submission} isSubmitting={isSubmitting} />
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
          Password reset successfully! You can now log in with your new password.
        </Alert>
      </Snackbar>
    </div>
  );
}