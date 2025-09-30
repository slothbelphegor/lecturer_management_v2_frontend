import { useState, useEffect } from "react";
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

import RecommendIcon from "@mui/icons-material/Recommend";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CircularProgress from "@mui/material/CircularProgress";
import RecommendationForm from "../../components/forms/full_forms/RecommendationForm";

import AxiosInstance from "../../components/AxiosInstance";

const EditRecommendation = () => {
  const [currentRecommendation, setCurrentRecommendation] = useState({});
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { id } = useParams();

  const handleCloseError = () => {
    setError(null);
  };
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    window.history.back();
  };

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await AxiosInstance.get(`/recommendations/${id}`);
      setCurrentRecommendation(response.data);
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
    AxiosInstance.put(`recommendations/${id}/`, {
      name: data.name,
      date: data.date,
      email: data.email,
      phone_number: data.phone_number,
      content: data.content,
      workplace: data.workplace,
      recommender: currentRecommendation.recommender,
      status: data.status,
      courses: data.courses,
    })
      .then((res) => {
        setShowSuccess(true);
      })
      .catch((err) => {
        console.error("Error editing evaluation:", err.response?.data || err);

        const errorData = err.response?.data;
        let errorMessage;

        if (errorData) {
          // Get the first error message from any field
          const firstErrorField = Object.values(errorData)[0];
          errorMessage = Array.isArray(firstErrorField)
            ? firstErrorField[0]
            : "Unexpected error occurred.";
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
          <RecommendIcon />
          <Typography
            sx={{ marginLeft: "15px", fontWeight: "bold" }}
            variant="subtitle2"
          >
            Recommendation Details
          </Typography>
        </Box>
      </Box>
      <RecommendationForm
        recommendation={currentRecommendation}
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
          Recommendation edited successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditRecommendation;
