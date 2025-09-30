import AxiosInstance from "../../components/AxiosInstance";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import MyTextField from "../../components/forms/MyTextField";
import MyButton from "../../components/forms/MyButton";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import MySelectField from "../../components/forms/MySelectField";

const MyAccount = () => {
  const [currentUser, setCurrentUser] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleCloseError = () => {
    setError(null);
  };

  const getData = async () => {
    setIsLoading(true);

    try {
      const userResponse = await AxiosInstance.get(`users/me/`);
      setCurrentUser(userResponse.data);
    } catch (error) {
      console.error("Error fetching user info:", error);
      setError("Error fetching user info.");
    } finally {
      setIsLoading(false);
    }
  };

  const { control } = useForm({
    values: {
      username: currentUser.username,
      email: currentUser.email,
    },
  });

  useEffect(() => {
    getData();
  }, []); // get data on initial load page

  return (
    <div>
      <Box className="topbar">
        <InfoIcon />
        <Typography
          sx={{ marginLeft: "15px", fontWeight: "bold" }}
          variant="subtitle2"
        >
          Your Account Information
        </Typography>
      </Box>
      <form>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Box
            className="formBox"
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gridTemplateRows: "repeat(1, 1fr)",
            }}
          >
            <Box
              className="formArea"
              sx={{ width: "100%", gridColumn: "span 4" }}
            >
              <MyTextField
                className="formField"
                label={"Username"}
                name="username"
                control={control}
                disabled={true}
              />
            </Box>

            <Box
              className="formArea"
              sx={{ gridColumn: "span 4", width: "100%" }}
            >
              <MyTextField
                className="formField"
                label={"Email"}
                name="email"
                control={control}
                disabled={true}
              />
            </Box>

            <Box
              className="formArea"
              sx={{ gridColumn: "span 2", width: "100%" }}
            >
              <Link to={"/request_password_reset"}>Change Password</Link>
            </Box>
          </Box>
        )}
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
    </div>
  );
};

export default MyAccount;
