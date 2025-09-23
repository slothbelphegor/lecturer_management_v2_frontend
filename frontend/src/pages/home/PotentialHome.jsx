import AxiosInstance from "../../components/AxiosInstance";
import { React, useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Alert, Snackbar } from "@mui/material";

export default function PotentialHome() {
  const [currentStatus, setCurrentStatus] = useState(null);
  const [hasInfo, setHasInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const handleCloseError = () => setError(null);
  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await AxiosInstance.get("lecturers/me/");
      setCurrentStatus(response.data.status);
      setHasInfo(response.data && !!response.data.status);
    } catch (error) {
      setError("Error fetching lecturer details.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, []); // get data on initial load page
  if (isLoading) {
    return <CircularProgress />;
  }
  return (
    <div>
      <Typography variant="h6" sx={{ textAlign: "left", margin: "20px 0" }}>
        Xin chào!
      </Typography>
      {!hasInfo ? (
        <Typography
          variant="h7"
          sx={{ textAlign: "center", marginBottom: "20px" }}
        >
          Bạn là giảng viên tiềm năng, hãy cập nhật thông tin cá nhân của bạn để
          có thể được xét duyệt trở thành giảng viên chính thức.
        </Typography>
      ) : (
        <>
          <Typography
            variant="h7"
            sx={{ textAlign: "center", marginBottom: "20px" }}
          >
            Bạn đã cập nhật thông tin cá nhân, hãy chờ đợi để được xét duyệt trở
            thành giảng viên chính thức.
          </Typography>
          <br />
          <Typography
            variant="h7"
            sx={{ textAlign: "center", marginBottom: "20px" }}
          >
            Tình trạng hồ sơ của bạn: {currentStatus}
          </Typography>
        </>
      )}
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
    </div>
    
    );
};
