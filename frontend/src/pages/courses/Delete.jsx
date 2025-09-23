import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Alert, Snackbar } from "@mui/material";

import CircularProgress from "@mui/material/CircularProgress";

import DeleteIcon from "@mui/icons-material/Delete";
import MyButton from "../../components/forms/MyButton";

import AxiosInstance from "../../components/AxiosInstance";

export default function DeleteCourse() {
  const [currentCourse, setCurrentCourse] = useState({});
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const { id } = useParams();

  const handleCloseError = () => {
    setError(null);
    window.location.reload();
  }
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    window.location.href = "/courses";
  };

  const getData = async () => {
    if (!currentCourse.id) {
      setIsLoading(true);
    }

    try {
      const response = await AxiosInstance.get(`/courses/${id}`);
      setCurrentCourse(response.data);
    } catch (error) {
      console.error("Error fetching course details:", error);
      setError("Error fetching course details.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const deleteRecord = (event) => {
    event.preventDefault();
    console.log(currentCourse);
    

    setIsLoading(true);
    AxiosInstance.delete(`courses/${id}/`)
      .then(() => {
        setShowSuccess(true);
      })
      .catch((err) => {
        console.error("Error deleting course:", err.response?.data || err);
        const errorData = err.response?.data;
        let errorMessage;

        if (errorData) {
          // Get the first error message from any field
          const firstErrorField = Object.values(errorData)[0];
          errorMessage = Array.isArray(firstErrorField)
            ? firstErrorField[0]
            : "Unexpected error occurred.";
        } else {
          errorMessage = "Unexpected error occurred while deleting the course.";
        }
        setError(errorMessage);
      })
      .finally(() => {
        setIsLoading(false);
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
      <Box className="topbar">
        <DeleteIcon />
        <Typography
          sx={{ marginLeft: "15px", fontWeight: "bold" }}
          variant="subtitle2"
        >
          Are you sure that you want to delete this course?
        </Typography>
      </Box>
      <form onSubmit={deleteRecord}>
        <Box
          className="formBox"
          sx={{ display: "flex", flexDirection: "column" }}
          onSubmit={deleteRecord}
        >
          <Box className="formArea">
            <Typography>
              You will delete <strong>{currentCourse.name}.</strong> with code{" "}
              <strong>{currentCourse.code}</strong>.
            </Typography>
          </Box>
          <Box sx={{ marginTop: "30px" }}>
            <MyButton type="submit" fullWidth label={"Delete"}></MyButton>
          </Box>
        </Box>
      </form>
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
          Course deleted successfully!
        </Alert>
      </Snackbar>
    </>
  );
}
