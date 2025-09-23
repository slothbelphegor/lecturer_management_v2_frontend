import { useState } from "react";
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import { format } from 'date-fns'

import AddBoxIcon from "@mui/icons-material/AddBox";
import DocumentForm from "../../components/forms/full_forms/DocumentForm";

import AxiosInstance from "../../components/AxiosInstance";

const CreateDocument = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCloseError = () => setError(null);
  const handleCloseSuccess = () => {
    setShowSuccess(false)
    window.location.href = "/documents";
  };

  const submission = (data) => {
    setIsSubmitting(true);
    setError(null);
    console.log("Form data submitted:", data);
    AxiosInstance.post("documents/", {
      name: data.name,
      document_type: data.document_type,
      file_link: data.file_link,
      published_at: data.published_at ? format(new Date(data.published_at), 'yyyy-MM-dd') : null,
      valid_at: data.valid_at ? format(new Date(data.valid_at), 'yyyy-MM-dd') : null,
      published_by: data.published_by,
      signed_by: data.signed_by,
    })
      .then((res) => {
        console.log("Document created successfully:", res.data);
        setShowSuccess(true);
      })
      .catch((err) => {
        console.error("Error creating document:", err.response?.data || err);
        
        const errorData = err.response?.data;
        let errorMessage;

        if (errorData) {
          // Get the first error message from any field
          const firstErrorField = Object.values(errorData)[0];
          errorMessage = Array.isArray(firstErrorField) ? firstErrorField[0] : "Unexpected error occurred.";
        } else {
          errorMessage = "Unexpected error occurred while creating the document.";
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
            Add New Document
          </Typography>
        </Box>
      </Box>
      <DocumentForm
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
          Document created successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateDocument;
