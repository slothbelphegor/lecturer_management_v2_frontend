import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Snackbar, Alert, CircularProgress } from "@mui/material";
import { format } from 'date-fns'

import AddBoxIcon from "@mui/icons-material/AddBox";
import DocumentForm from "../../components/forms/full_forms/DocumentForm";

import AxiosInstance from "../../components/AxiosInstance";
import ClassForm from "../../components/forms/full_forms/ClassForm";

const EditClass = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentClass, setCurrentClass] = useState(null)
  const {id} = useParams()

  const handleCloseError = () => setError(null);
  const handleCloseSuccess = () => {
    setShowSuccess(false)
    window.location.href = "/classes";
  };

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await AxiosInstance.get(`/classes/${id}`);
      setCurrentClass(response.data);
    } catch (error) {
      console.error("Error fetching class details:", error);
      setError("Error fetching class details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
      getData();
    }, [id]);
 

  const submission = (data) => {
    setIsSubmitting(true);
    setError(null);
    console.log("Form data submitted:", data);
    AxiosInstance.put(`classes/${id}/`, {
      name: data.name,
      course: data.course,
      lecturer: data.lecturer,
      year: data.year,
      semester: data.semester,
    })
      .then((res) => {
        console.log("Class created successfully:", res.data);
        setShowSuccess(true);
      })
      .catch((err) => {
        console.error("Error creating class:", err.response?.data || err);
        
        const errorData = err.response?.data;
        let errorMessage;

        if (errorData) {
          // Get the first error message from any field
          const firstErrorField = Object.values(errorData)[0];
          errorMessage = Array.isArray(firstErrorField) ? firstErrorField[0] : "Unexpected error occurred.";
        } else {
          errorMessage = "Unexpected error occurred while creating the class.";
        }

        setError(errorMessage);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (isLoading) {
      return (
        <Box sx={{ textAlign: "center", marginTop: "20px" }}>
          <CircularProgress />
        </Box>
      );
    }

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
            Edit Class Info
          </Typography>
        </Box>
      </Box>
      <ClassForm
        submission={submission}
        isSubmitting={isSubmitting}
        classObj={currentClass}
        />

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
          Class edited successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditClass;
