import AxiosInstance from "../../components/AxiosInstance";
import { React, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
import MyPasswordField from "../../components/forms/MyPasswordField";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import MySelectField from "../../components/forms/MySelectField";

const CreateUser = () => {
  const [lecturers, setLecturers] = useState();
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoadingLecturer, setIsLoadingLecturer] = useState(true);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);

  const handleCloseError = () => {
    setError(null);
    window.location.reload();
  };
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    window.location.href = "/users";
  };

  const schema = yup.object().shape({
    username: yup.string().required("Username is required"),
    email: yup
      .string()
      .email("Field expected an email address")
      .required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .matches(/[A-Z]/, "Password must contain at least 1 uppercase letter")
      .matches(/[a-z]/, "Password must contain at least 1 lowercase letter")
      .matches(/[0-9]/, "Password must contain at least 1 number")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least 1 special character"
      ),
    password2: yup
      .string()
      .required("Password confirmation is required")
      .oneOf([yup.ref("password"), null], "Passwords must match"),
  });

  const getData = async () => {
    setIsLoadingLecturer(true);
    setIsLoadingGroups(true);
    try {
      const lecturersResponse = await AxiosInstance.get(
        "lecturers/all_lecturers/"
      );
      setLecturers(lecturersResponse.data);
    } catch (error) {
      console.error("Error fetching lecturers:", error);
      setError("Error fetching lecturers.");
    } finally {
      setIsLoadingLecturer(false);
    }

    try {
      const groupsResponse = await AxiosInstance.get(`groups/`);
      setGroups(groupsResponse.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
      setError("Error fetching user groups.");
    } finally {
      setIsLoadingGroups(false);
    }
  };

  const lecturerOptions = useMemo(
    () =>
      lecturers
        ?.filter((l) => !l.user)
        .map((l) => ({
          value: l.id,
          id: l.id,
          showValue: `${l.name} - ${l.workplace}`,
        })) || [],
    [lecturers]
  );
  const groupOptions = useMemo(
    () =>
      groups?.map((group) => ({
        id: group.id,
        value: group.id,
        showValue: `${group.name}`,
      })) || [],
    [groups]
  );

  const { control, handleSubmit, watch, reset } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    getData();
  }, []); // get data on initial load page

  // Reset form when all data is loaded and stable

  const selectedGroup = watch("group");

  const submission = (data) => {
    setIsSubmitting(true);
    setError(null);
    AxiosInstance.post(`users/`, {
      username: data.username,
      email: data.email,
      lecturer: data.lecturer,
      groups: [selectedGroup],
      password: data.password,
    })
      .then((res) => {
        setShowSuccess(true);
      })
      .catch((err) => {
        console.error("Error creating user:", err.response?.data || err);

        const errorData = err.response?.data;
        let errorMessage;

        if (errorData) {
          // Get the first error message from any field
          const firstErrorField = Object.values(errorData)[0];
          errorMessage = Array.isArray(firstErrorField)
            ? firstErrorField[0]
            : "Unexpected error occurred.";
        } else {
          errorMessage = "Unexpected error occurred while creating the user.";
        }

        setError(errorMessage);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div>
      <Box className="topbar">
        <InfoIcon />
        <Typography
          sx={{ marginLeft: "15px", fontWeight: "bold" }}
          variant="subtitle2"
        >
          New User
        </Typography>
      </Box>
      <form
        onSubmit={handleSubmit(submission, (errors) =>
          console.log("Validation Errors:", errors)
        )}
      >
        {isLoadingGroups || isLoadingLecturer ? (
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
              />
            </Box>
            <Box
              className="formArea"
              sx={{ gridColumn: "span 4", width: "100%" }}
            >
              <MyPasswordField
                className="formField"
                label={"Mật khẩu"}
                name="password"
                control={control}
              />
            </Box>
            <Box
              className="formArea"
              sx={{ gridColumn: "span 4", width: "100%" }}
            >
              <MyPasswordField
                className="formField"
                label={"Nhập lại mật khẩu"}
                name="password2"
                control={control}
              />
            </Box>
            <Box
              className="formArea"
              sx={{ gridColumn: "span 4", width: "100%" }}
            >
              {groups ? (
                <MySelectField
                  className="formField"
                  label={"Loại tài khoản"}
                  name="group"
                  control={control}
                  options={groupOptions}
                />
              ) : null}
            </Box>
            <Box
              className="formArea"
              sx={{ gridColumn: "span 4", width: "100%" }}
            >
              {["lecturer", "potential_lecturer"].includes(
                groupOptions?.find((g) => g.id === selectedGroup)?.showValue
              ) && (
                <MySelectField
                  className="formField"
                  label={"Giảng viên liên kết"}
                  name="lecturer"
                  control={control}
                  options={lecturerOptions}
                />
              )}
            </Box>

            <Box
              className="formArea"
              sx={{ gridColumn: "span 4", width: "100%" }}
            >
              <MyButton
                type="submit"
                fullWidth
                label={"Submit"}
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              ></MyButton>
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
          User created successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CreateUser;
