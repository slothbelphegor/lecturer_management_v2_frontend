import { use, useEffect, useState } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import AxiosInstance from "../../components/AxiosInstance";
import MyPieChart from "../../components/charts/MyPieChart";
import MyBarChart from "../../components/charts/MyBarChart";
import MyChartBox from "../../components/charts/MyChartBox";
import MyStatBox from "../../components/statistics/MyStatBox";
import getUserRole from "../../components/GetUserRole";

export default function StaffHome() {
  const [courseLecturerCount, setCourseLecturerCount] = useState(null);
  const [degreeLecturerCount, setDegreeLecturerCount] = useState(null);
  const [titleLecturerCount, setTitleLecturerCount] = useState(null);
  const [allLecturersCount, setAllLecturersCount] = useState(0);
  const [potentialLecturersCount, setPotentialLecturersCount] = useState(0);
  const [pendingRecommendationsCount, setPendingRecommendationsCount] =
    useState(null);
  const [pendingLecturers, setPendingLecturers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const role = getUserRole();

  const handleCloseError = () => {
    setError(null);
  };

  const getData = async () => {
    setIsLoading(true);
    try {
      const [
        courseLecturerRes,
        degreeLecturerRes,
        titleLecturerRes,
        allLecturersRes,
      ] = await Promise.all([
        AxiosInstance.get("/courses/lecturer_count/"),
        AxiosInstance.get("/lecturers/degree_count/"),
        AxiosInstance.get("/lecturers/title_count/"),
        AxiosInstance.get("/lecturers/count_all_lecturers/"),
      ]);
      setCourseLecturerCount(courseLecturerRes.data);
      setDegreeLecturerCount(degreeLecturerRes.data);
      setTitleLecturerCount(titleLecturerRes.data);
      setAllLecturersCount(allLecturersRes.data);
      if (["it_faculty", "education_department"].includes(role)) {
        const potentialLecturersRes = await AxiosInstance.get(
          "/lecturers/count_potential_lecturers/"
        );
        setPotentialLecturersCount(potentialLecturersRes.data);
        if (role == "it_faculty") {
          const pendingRecommendationsRes = await AxiosInstance.get(
            "/recommendations/count_unchecked/"
          );
          setPendingRecommendationsCount(pendingRecommendationsRes.data);
        } else {
          const pendingLecturersRes = await AxiosInstance.get(
            "/lecturers/count_pending_lecturers/"
          );
          setPendingLecturers(pendingLecturersRes.data);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (isLoading) {
    return (
      <CircularProgress
        size={60}
        thickness={4}
        style={{ margin: "20px auto", display: "block" }}
      />
    );
  }

  return (
    <>
      <MyStatBox
        icon1={<PeopleIcon />}
        title1={"Tổng số giảng viên đang công tác"}
        stat1={allLecturersCount}
        icon3={<PeopleIcon />}
        title3={
          role == "it_faculty"
            ? "Số đề xuất thỉnh giảng đợi duyệt"
            : role == "education_department"
            ? "Số hồ sơ thỉnh giảng đã hợp lệ"
            : null
        }
        stat3={
          role == "it_faculty"
            ? pendingRecommendationsCount
            : role == "education_department"
            ? pendingLecturers
            : null
        }
        icon2={<PeopleIcon />}
        title2="Số hồ sơ đăng ký thỉnh giảng đợi duyệt"
        stat2={
          ["it_faculty", "education_department"].includes(role)
            ? potentialLecturersCount
            : null
        }
      />
      <MyChartBox
        icon1={<PeopleIcon />}
        title1="Số lượng giảng viên theo môn học"
        chart1={<MyBarChart myData={courseLecturerCount} />}
      />
      <MyChartBox
        icon2={<PeopleIcon />}
        title2="Tỉ lệ trình độ giảng viên"
        chart2={
          <MyPieChart
            myData={degreeLecturerCount?.map((item) => {
              return {
                value: item.percentage,
                label: item.degree,
              };
            })}
          />
        }
        icon3={<PeopleIcon />}
        title3="Tỉ lệ học hàm giảng viên"
        chart3={
          <MyPieChart
            myData={titleLecturerCount?.map((item) => {
              return {
                value: item.percentage,
                label: item.title,
              };
            })}
          />
        }
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
    </>
  );
}
