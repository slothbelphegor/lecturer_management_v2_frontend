import { useState } from "react";
import {  Snackbar, Alert } from "@mui/material";
import AxiosInstance from "../../components/AxiosInstance";
import UserEmailForm from "../../components/forms/full_forms/PasswordResetRequestForm";

export default function PasswordResetRequest() {
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCloseError = () => {
    setError(null);
  };
  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  const submission = (data) => {
    setIsSubmitting(true);
    setError(null);
    console.log("Form data submitted:", data);
    AxiosInstance.post("api/password_reset/", {
      email: data.email,
    })
      .then((res) => {
        console.log("Password reset request sent successfully:", res.data);
        setShowSuccess(true);
      })
      .catch((err) => {
        console.error(
          "Error sending password reset request:",
          err.response?.data || err
        );

        const errorData = err.response?.data;
        let errorMessage;

        if (errorData) {
          // Get the first error message from any field
          errorMessage = Object.values(errorData)[0];
        } else {
          errorMessage =
            "Unexpected error occurred while sending the password reset request.";
        }

        setError(errorMessage);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };
  return (
  <div>
    <UserEmailForm
      submission={submission}
      isSubmitting={isSubmitting}
      title={"Request Password Reset"}
    />
    {/* Error Snackbar */}
    <Snackbar
      open={!!error}
      autoHideDuration={6000}
      onClose={handleCloseError}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={handleCloseError} severity="error" sx={{ width: "100%" }}>
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
        An email has been sent. Please check your email.
      </Alert>
    </Snackbar>
  </div>
);
}


