import { useState, useEffect } from "react";
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

import ArticleIcon from '@mui/icons-material/Article';
import CircularProgress from "@mui/material/CircularProgress";

import DocumentForm from "../../components/forms/full_forms/DocumentForm";

import AxiosInstance from "../../components/AxiosInstance";

const EditDocument = () => {
  const [currentDocument, setCurrentDocument] = useState({});
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { id } = useParams();

  const handleCloseError = () => {
    setError(null);
    window.location.reload();
  }
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    window.location.href = "/documents";
  };

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await AxiosInstance.get(`/documents/${id}`);
      setCurrentDocument(response.data);
    } catch (error) {
      console.error("Error fetching document details:", error);
      setError("Error fetching document details.");
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
    AxiosInstance.put(`documents/${id}/`, {
      name: data.name,
      document_type: data.document_type,
      file_link: data.file_link,
      published_at: data.published_at
        ? format(new Date(data.published_at), "yyyy-MM-dd")
        : null,
      valid_at: data.valid_at
        ? format(new Date(data.valid_at), "yyyy-MM-dd")
        : null,
      published_by: data.published_by,
      signed_by: data.signed_by,
    })
      .then((res) => {
        console.log("Document edited successfully:", res.data);
        setShowSuccess(true);
      })
      .catch((err) => {
        console.error("Error editing document:", err.response?.data || err);

        const errorData = err.response?.data;
        let errorMessage;

        if (errorData) {
          // Get the first error message from any field
          const firstErrorField = Object.values(errorData)[0];
          errorMessage = Array.isArray(firstErrorField) ? firstErrorField[0] : "Unexpected error occurred.";
        } else {
          errorMessage = "Unexpected error occurred while editing the document.";
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
          <ArticleIcon />
          <Typography
            sx={{ marginLeft: "15px", fontWeight: "bold" }}
            variant="subtitle2"
          >
            Document Details
          </Typography>
        </Box>
      </Box>
      <DocumentForm
        submission={submission}
        isSubmitting={isSubmitting}
        document={currentDocument}
      />

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
          Document edited successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditDocument;
