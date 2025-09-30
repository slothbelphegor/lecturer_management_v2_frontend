import { useState, useEffect } from "react";
import { Box, CircularProgress, Snackbar, Alert } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import MyTextField from "../MyTextField";
import MyButton from "../MyButton";
import MySelectField from "../MySelectField";

import AxiosInstance from "../../AxiosInstance";

export default function ClassForm({ classObj, submission, isSubmitting }) {
  const [error, setError] = useState(false);
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleCloseError = () => setError(null);

  const lecturerOptions = lecturers.map((lecturer) => ({
    id: lecturer.id,
    value: lecturer.id,
    showValue: `${lecturer.name} - ${lecturer.workplace}`,
  }));

  const courseOptions = courses.map((course) => ({
    id: course.id,
    value: course.id,
    showValue: `${course.name} - ${course.code}`,
  }));

  const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    course: yup.number().required("Course is required"),
    lecturer: yup.number().required("Lecturer is required"),
    semester: yup
      .number()
      .typeError("Semester must be a number")
      .integer("Invalid semester value")
      .min(1, "Invalid semester value")
      .max(2, "Invalid semester value")
      .required("Invalid semester value"),
    year: yup.string().required("Year is required"),
  });

  const getData = async () => {
    setIsLoading(true);
    try {
      const courseResponse = await AxiosInstance.get("courses/all_courses/");
      setCourses(courseResponse.data);
      const lecturersResponse = await AxiosInstance.get(
        "lecturers/all_lecturers/"
      );
      setLecturers(lecturersResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data.");
    } finally {
      setIsLoading(false);
    }
  };

  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(schema),
  });


  // get data once
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (classObj) {
      const formValues = {
        name: classObj.name,
        course: classObj.course,
        lecturer: classObj.lecturer,
        year: classObj.year,
        semester: classObj.semester,
      };
      reset(formValues);
    }
  }, [classObj, reset]); // get data upon receiving info from server

  

  
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
              label={"Class name"}
              name="name"
              control={control}
            />
          </Box>
          <Box
            className="formArea"
            sx={{ gridColumn: "span 4", width: "100%" }}
          >
            <MySelectField
              label={"Lecturer"}
              name="lecturer"
              className="formField"
              options={lecturerOptions}
              control={control}
            />
          </Box>
          <Box
            className="formArea"
            sx={{ gridColumn: "span 4", width: "100%" }}
          >
            <MySelectField
              label={"Course"}
              name="course"
              className="formField"
              options={courseOptions}
              control={control}
            />
          </Box>
          <Box
            className="formArea"
            sx={{ gridColumn: "span 2", width: "100%" }}
          >
            <MyTextField
              className="formField"
              label={"Year"}
              name="year"
              control={control}
            />
          </Box>
          <Box
            className="formArea"
            sx={{ gridColumn: "span 2", width: "100%" }}
          >
            <MyTextField
              className="formField"
              label={"Semester"}
              name="semester"
              control={control}
            />
          </Box>

          <Box
            className="formArea"
            sx={{ gridColumn: "span 4", width: "100%" }}
          >
            <MyButton
              type="submit"
              fullWidth
              label={isSubmitting ? "Submitting..." : "Submit"}
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            />
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
