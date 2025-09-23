import { useState } from "react";
import { Box, Typography, Snackbar, Alert } from "@mui/material";

import AddBoxIcon from "@mui/icons-material/AddBox";
import CourseForm from "../../components/forms/full_forms/CourseForm";

import AxiosInstance from "../../components/AxiosInstance";


const CreateCourse = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCloseError = () => setError(null);
  const handleCloseSuccess = () => {
    setShowSuccess(false)
    window.location.reload();
  };

  const submission = (data) => {
    setIsSubmitting(true);
    setError(null);
    console.log("Form data submitted:", data);
    AxiosInstance.post("courses/", {
      name: data.name,
      code: data.code,
      description: data.description,
      credits: data.credits,
    })
      .then((res) => {
        console.log("Course created successfully:", res.data);
        setShowSuccess(true);
      })
      .catch((err) => {
        console.error("Error creating course:", err.response?.data || err);
        
        const errorData = err.response?.data;
        let errorMessage;

        if (errorData) {
          // Get the first error message from any field
          const firstErrorField = Object.values(errorData)[0];
          errorMessage = Array.isArray(firstErrorField) ? firstErrorField[0] : "Unexpected error occurred.";
        } else {
          errorMessage = "Unexpected error occurred while creating the course.";
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
            Add New Course
          </Typography>
        </Box>
      </Box>
      <CourseForm
        submission={submission}
        isSubmitting={isSubmitting}/>

      {/* Error Snackbar */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Success Snackbar */}
      <Snackbar 
        open={showSuccess} 
        autoHideDuration={6000} 
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          Course created successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateCourse;
