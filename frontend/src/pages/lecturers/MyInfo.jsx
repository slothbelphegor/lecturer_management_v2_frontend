import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { format } from "date-fns";
import { useParams, useNavigate } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";

import AxiosInstance from "../../components/AxiosInstance";
import getUserRole from "../../components/GetUserRole";
import LecturerInfoForm from "../../components/forms/full_forms/LecturerForm";

const MyInfo = () => {
  const params = useParams();
  const lecturer_id = params.id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLecturer, setCurrentLecturer] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [lecturers, setLecturers] = useState({});
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const currentRole = getUserRole();

  const handleCloseError = () => setError(null);
  const handleCloseInfo = () => setMessage(null);
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    window.location.reload();
  };

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await AxiosInstance.get(`lecturers/me/`);
      setCurrentLecturer(response.data);
    } catch (error) {
      if (
        currentRole == "potential_lecturer" &&
        error.response &&
        error.response.status === 404
      ) {
        setMessage(
          "You have not created your lecturer profile yet. Please fill out the form and submit to create your profile."
        );
      } else {
        setError("Error fetching lecturer details.");
        console.error("Error fetching lecturer details:", error);
      }
    }
    if (currentRole == "potential_lecturer") {
      try {
        const userResponse = await AxiosInstance.get(`users/me/`);
        setCurrentUser(userResponse.data);
      } catch (error) {
        setError("Error fetching user details.");
        console.error("Error fetching user details:", error);
      }
    }

    try {
      const lecturersResponse = await AxiosInstance.get(`lecturers/`);
      setLecturers(lecturersResponse.data);
    } catch (error) {
      setError("Error fetching lecturers list.");
      console.error("Error fetching lecturers list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []); // get data on initial load page

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
    const researches = data.researches?.map((research) => ({
      name: research.name,
      year: research.year,
      position: research.position,
      level: research.level,
    }));
    const publishedWorks = data.publishedWorks?.map((work) => ({
      name: work.name,
      year: work.year,
      place: work.place,
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
      researches: researches,
      published_works: publishedWorks,
      courses: data.courses,
      recommender: data.recommender,
      status: data.status,
      user: currentLecturer.user,
    };
    if (currentRole == "potential_lecturer" && !currentLecturer.user) {
      sentData["status"] = "Chưa duyệt hồ sơ";
      AxiosInstance.post(`lecturers/me/`, sentData)
        .then((res) => {
          setShowSuccess(true);
        })
        .catch((err) => {
          console.error(
            "Error submitting lecturer:",
            err.response?.data || err
          );

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
    } else {
      AxiosInstance.put(`lecturers/me/`, sentData)
        .then((res) => {
          setShowSuccess(true);
        })
        .catch((err) => {
          console.error("Error editing lecturer:", err.response?.data || err);

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
    }
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
          <InfoIcon />
          <Typography
            sx={{ marginLeft: "15px", fontWeight: "bold" }}
            variant="subtitle2"
          >
            Your Information
          </Typography>
        </Box>
      </Box>
      <LecturerInfoForm
        submission={submission}
        lecturer={currentLecturer}
        isEdit={true}
        isSubmitting={isSubmitting}
        isSelfLecturer={true}
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

      {/* Info Snackbar */}
      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={handleCloseInfo}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseInfo} severity="info" sx={{ width: "100%" }}>
          {message}
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
          Lecturer information edited successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default MyInfo;
