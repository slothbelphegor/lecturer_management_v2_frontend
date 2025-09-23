import { useState, useEffect } from "react";
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CircularProgress from "@mui/material/CircularProgress";
import EvaluationForm from "../../components/forms/full_forms/EvaluationForm";

import AxiosInstance from "../../components/AxiosInstance";

const EditEvaluation = () => {
  const [currentEvaluation, setCurrentEvaluation] = useState({});
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
    window.location.reload();
  };

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await AxiosInstance.get(`/evaluations/${id}`);
      setCurrentEvaluation(response.data);
    } catch (error) {
      console.error("Error fetching evaluation details:", error);
      setError("Error fetching evaluation details.");
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
    AxiosInstance.put(`evaluations/${id}/`, {
        title: data.title,
        date: format(new Date(data.date), 'yyyy-MM-dd'),
        type: data.type,
        content: data.content,
        lecturer: currentEvaluation.lecturer
    })
      .then((res) => {
        console.log("Evaluation edited successfully:", res.data);
        setShowSuccess(true);
      })
      .catch((err) => {
        console.error("Error editing evaluation:", err.response?.data || err);

        const errorData = err.response?.data;
        let errorMessage;

        if (errorData) {
          // Get the first error message from any field
          const firstErrorField = Object.values(errorData)[0];
          errorMessage = Array.isArray(firstErrorField) ? firstErrorField[0] : "Unexpected error occurred.";
        } else {
          errorMessage = "Unexpected error occurred while editing.";
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
          <ThumbUpIcon />
          <Typography
            sx={{ marginLeft: "15px", fontWeight: "bold" }}
            variant="subtitle2"
          >
            Evaluation Details
          </Typography>
        </Box>
      </Box>
      <EvaluationForm
        evaluation={currentEvaluation}
        submission={submission}
        isSubmitting={isSubmitting}
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
          Evaluation edited successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditEvaluation;
