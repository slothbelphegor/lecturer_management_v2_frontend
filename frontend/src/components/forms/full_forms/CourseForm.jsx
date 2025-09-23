import { useState, useEffect } from "react";
import { Box, CircularProgress, Snackbar, Alert } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import MyTextField from "../MyTextField";
import MyButton from "../MyButton";
import MyDescriptionField from "../MyDescriptionField";

export default function CourseForm({ course, submission, isSubmitting }) {
  const [error, setError] = useState(false);


  const handleCloseError = () => setError(null);


  useEffect(() => {
    if (course) {
      const formValues = {
        name: course.name,
        code: course.code,
        description: course.description,
        credits: course.credits,
      };
      reset(formValues);
    }
  }, []); // get data on initial load page


  const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    code: yup.string().required("Code is required"),
    description: yup.string(),
    credits: yup.number().typeError("Credits must be a number").integer("Credits must be an integer").min(0, "Credits cannot be negative").required("Credits are required"),
  });

  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      credits: "",
    },
  });

 

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
            sx={{ width: "100%", gridColumn: "span 2" }}
          >
            <MyTextField
              className="formField"
              label={"Course name"}
              name="name"
              control={control}
            />
          </Box>
          <Box
            className="formArea"
            sx={{ gridColumn: "span 1", width: "100%" }}
          >
            <MyTextField
              className="formField"
              label={"Course code"}
              name="code"
              control={control}
            />
          </Box>
          <Box
            className="formArea"
            sx={{ gridColumn: "span 1", width: "100%" }}
          >
            <MyTextField
              className="formField"
              label={"Credits"}
              name="credits"
              control={control}
            />
          </Box>
          <Box
            className="formArea"
            sx={{ gridColumn: "span 4", width: "100%" }}
          >
            <MyDescriptionField
              className="formField"
              label={"Description (brief info about the course, conditions for enrollment, etc.)"}
              name="description"
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
