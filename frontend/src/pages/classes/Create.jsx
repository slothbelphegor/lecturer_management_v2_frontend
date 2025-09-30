import { useState } from "react";
import { Box, Typography, Snackbar, Alert } from "@mui/material";

import AddBoxIcon from "@mui/icons-material/AddBox";

import AxiosInstance from "../../components/AxiosInstance";
import ClassForm from "../../components/forms/full_forms/ClassForm";

const CreateClass = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCloseError = () => setError(null);
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    window.location.href = "/classes";
  };

  const submission = (data) => {
    setIsSubmitting(true);
    setError(null);
    AxiosInstance.post("classes/", {
      name: data.name,
      course: data.course,
      lecturer: data.lecturer,
      year: data.year,
      semester: data.semester,
    })
      .then((res) => {
        setShowSuccess(true);
      })
      .catch((err) => {
        console.error("Error creating class:", err.response?.data || err);

        const errorData = err.response?.data;
        let errorMessage;

        if (errorData) {
          // Get the first error message from any field
          const firstErrorField = Object.values(errorData)[0];
          errorMessage = Array.isArray(firstErrorField)
            ? firstErrorField[0]
            : "Unexpected error occurred.";
        } else {
          errorMessage = "Unexpected error occurred while creating the class.";
        }

        setError(errorMessage);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <>
      <Box
        className="topbar"
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <AddBoxIcon />
          <Typography
            sx={{ marginLeft: "15px", fontWeight: "bold" }}
            variant="subtitle2"
          >
            Add New Class
          </Typography>
        </Box>
      </Box>
      <ClassForm submission={submission} isSubmitting={isSubmitting} />

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
          Class created successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateClass;
