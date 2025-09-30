import { useState } from "react";
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import { format } from "date-fns";

import AddBoxIcon from "@mui/icons-material/AddBox";

import AxiosInstance from "../../components/AxiosInstance";
import LecturerInfoForm from "../../components/forms/full_forms/LecturerForm";

const CreateLecturer = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCloseError = () => setError(null);
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    window.location.href = "/lecturers";
  };

  const submission = (data) => {
    setIsSubmitting(true);
    setError(null);
    const academics = {
      CN: {
        school_name: data.school_name_CN,
        major: data.major_CN,
        from: format(new Date(data.from_CN), "yyyy-MM-dd"),
        to: format(new Date(data.to_CN), "yyyy-MM-dd"),
        degree_granted_at: format(
          new Date(data.degree_granted_at_CN),
          "yyyy-MM-dd"
        ),
      },
      // include this only when degree is ThS or TS
      ThS:
        data.degree === "Thạc sĩ" || data.degree === "Tiến sĩ"
          ? {
              school_name: data.school_name_ThS,
              major: data.major_ThS,
              from: format(new Date(data.from_ThS), "yyyy-MM-dd"),
              to: format(new Date(data.to_ThS), "yyyy-MM-dd"),
              degree_granted_at: format(
                new Date(data.degree_granted_at_ThS),
                "yyyy-MM-dd"
              ),
            }
          : null,
      TS:
        data.degree === "Tiến sĩ"
          ? {
              school_name: data.school_name_TS,
              major: data.major_TS,
              from: format(new Date(data.from_TS), "yyyy-MM-dd"),
              to: format(new Date(data.to_TS), "yyyy-MM-dd"),
              degree_granted_at: format(
                new Date(data.degree_granted_at_TS),
                "yyyy-MM-dd"
              ),
            }
          : null,
    };
    const workExperiences = data.workExperiences?.map((exp) => ({
      organization: exp.organization,
      from: format(new Date(exp.from), "yyyy-MM-dd"),
      to: format(new Date(exp.to), "yyyy-MM-dd"),
    }));
    const sentData = {
      name: data.name,
      email: data.email,
      phone_number: data.phone,
      gender: data.gender,
      dob: format(new Date(data.dob), "yyyy-MM-dd"),
      ethnic: data.ethnic,
      religion: data.religion,
      hometown: data.hometown,
      degree: data.degree,
      title: data.title,
      title_detail: data.title_detail,
      title_granted_at: format(new Date(data.title_granted_at), "yyyy-MM-dd"),
      address: data.address,
      work_position: data.work_position,
      workplace: data.workplace,
      quota_code:
        data.quota_code === "Khác (nhập cụ thể)"
          ? data.other_quota_code
          : data.quota_code,
      salary_coefficient: data.salary_coefficient,
      salary_coefficient_granted_at: format(
        new Date(data.salary_coefficient_granted_at),
        "yyyy-MM-dd"
      ),
      recruited_at: format(new Date(data.recruited_at), "yyyy-MM-dd"),
      years_of_experience: data.years_of_experience,
      exp_language: data.exp_language,
      exp_computer: data.exp_computer,
      exp_work: workExperiences,
      exp_academic: academics,
      researches: data.researches,
      published_works: data.publishedWorks,
      courses: data.courses,
      recommender: data.recommender,
      status: data.status,
      user: null,
    };
    AxiosInstance.post("lecturers/", sentData)
      .then((res) => {
        setShowSuccess(true);
      })
      .catch((err) => {
        console.error("Error creating lecturer:", err.response?.data || err);

        const errorData = err.response?.data;
        let errorMessage;

        if (errorData) {
          // Get the first error message from any field
          const firstErrorField = Object.values(errorData)[0];
          errorMessage = Array.isArray(firstErrorField)
            ? firstErrorField[0]
            : "Unexpected error occurred.";
        } else {
          errorMessage =
            "Unexpected error occurred while creating the lecturer.";
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
            Add New Lecturer
          </Typography>
        </Box>
      </Box>
      <LecturerInfoForm submission={submission} />
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
          Lecturer created successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateLecturer;
