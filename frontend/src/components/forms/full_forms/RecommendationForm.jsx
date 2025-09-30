import { useState, useEffect } from "react";
import { Box, CircularProgress, Snackbar, Alert } from "@mui/material";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import MyTextField from "../MyTextField";
import MySelectField from "../MySelectField";
import MyMultiSelectField from "../MyMultiSelectField";
import MyButton from "../MyButton";
import MyDescriptionField from "../MyDescriptionField";

import AxiosInstance from "../../AxiosInstance";
import getUserRole from "../../GetUserRole";

export default function RecommendationForm({
  recommendation,
  submission,
  isSubmitting,
}) {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const role = getUserRole();
  const isChecking = role === "it_faculty" || role === "education_department";
  const handleCloseError = () => setError(null);

  const statusOptions = [
    {
      id: "1",
      value: "Chưa duyệt hồ sơ",
      label: "Chưa duyệt hồ sơ",
    },
    {
      id: "2",
      value: "Đang liên hệ",
      label: "Đang liên hệ",
    },
    { id: "3", value: "Hồ sơ hợp lệ", label: "Hồ sơ hợp lệ" },

    { id: "4", value: "Hồ sơ bị từ chối", label: "Hồ sơ bị từ chối" },
  ];

  const schema = yup.object().shape({
    name: yup.string().required("Chưa nhập tên giảng viên"),
    email: yup.string().email("Email không hợp lệ").required("Chưa nhập email"),
    phone_number: yup
      .string()
      .required("Chưa nhập số điện thoại")
      .matches(/^\+?[0-9]{7,14}$/, "Số điện thoại không hợp lệ"),
    workplace: yup.string().required("Chưa nhập nơi công tác"),
    content: yup.string().required("Chưa nhập mô tả sơ bộ về giảng viên"),
  });

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await AxiosInstance.get(`/courses/all_courses`);
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError("Error fetching courses.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
    if (recommendation) {
      const formValues = {
        name: recommendation.name,
        content: recommendation.content,
        courses: recommendation.courses,
        workplace: recommendation.workplace,
        email: recommendation.email,
        phone_number: recommendation.phone_number,
        status: recommendation.status,
      };
      reset(formValues);
    }
  }, []); // get data on initial load page

  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(schema),
  });

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", marginTop: "20px" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit(submission)}>
        <Box
          className="formBox"
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(1, 1fr)",
            opacity: isSubmitting ? 0.7 : 1,
            pointerEvents: isSubmitting ? "none" : "auto",
          }}
        >
          <Box
            className="formArea"
            sx={{ width: "100%", gridColumn: "span 4" }}
          >
            <MyTextField
              className="formField"
              label={"Recommended lecturer name"}
              name="name"
              control={control}
              disabled={isChecking}
            />
          </Box>
          <Box
            className="formArea"
            sx={{ width: "100%", gridColumn: "span 4" }}
          >
            <MyTextField
              className="formField"
              label={"Email"}
              name="email"
              control={control}
              disabled={isChecking}
            />
          </Box>
          <Box
            className="formArea"
            sx={{ width: "100%", gridColumn: "span 2" }}
          >
            <MyTextField
              className="formField"
              label={"Phone number"}
              name="phone_number"
              disabled={isChecking}
              control={control}
            />
          </Box>
          <Box
            className="formArea"
            sx={{ width: "100%", gridColumn: "span 4" }}
          >
            <MyTextField
              className="formField"
              label={"Workplace"}
              name="workplace"
              disabled={isChecking}
              control={control}
            />
          </Box>
          <Box
            className="formArea"
            sx={{ gridColumn: "span 4", width: "100%" }}
          >
            <MyMultiSelectField
              className="formField"
              label={"Specialized subjects"}
              name="courses"
              options={courses}
              disabled={isChecking}
              control={control}
            />
          </Box>

          <Box
            className="formArea"
            sx={{ width: "100%", gridColumn: "span 4" }}
          >
            <MyDescriptionField
              className="formField"
              label={
                "Brief description about the lecturer (research areas, achievements, etc.)"
              }
              name="content"
              rows={4}
              disabled={isChecking}
              control={control}
            />
          </Box>

          <Box
            className="formArea"
            sx={{ width: "100%", gridColumn: "span 4" }}
          >
            <MySelectField
              className="formField"
              label={"Status"}
              name="status"
              options={statusOptions}
              control={control}
              disabled={!isChecking}
            />
          </Box>

          <Box
            className="formArea"
            sx={{ gridColumn: "span 4", width: "100%" }}
          >
            <MyButton type="submit" fullWidth label={"Submit"}></MyButton>
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
    </>
  );
}
