import { useState, useEffect } from "react";
import { Box, CircularProgress, Snackbar, Alert } from "@mui/material";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import MyTextField from "../MyTextField";
import MySelectField from "../MySelectField";
import MyDateField from "../MyDateField";
import MyButton from "../MyButton";
import MyDescriptionField from "../MyDescriptionField";

import AxiosInstance from "../../AxiosInstance";

export default function EvaluationForm({ evaluation, submission, isSubmitting }) {
  const [error, setError] = useState(false);

  const handleCloseError = () => setError(null);

  const typeOptions = [
    {
      id: "1",
      value: "Đánh giá từ cán bộ đào tạo",
      label: "Cán bộ đánh giá",
    },
    {
      id: "2",
      value: "Phản ánh từ sinh viên",
      label: "Sinh viên phản ánh",
    },
    { id: "3", value: "Khác", label: "Khác" },
  ];

  const schema = yup.object().shape({
    title: yup.string().required("Chưa nhập tiêu đề"),
    date: yup
      .date()
      .typeError("Chưa nhập ngày đánh giá")
      .max(new Date(), "Ngày không được lớn hơn ngày hiện tại"),
    type: yup.string().required("Chưa chọn loại đánh giá"),
    content: yup.string().required("Chưa nhập nội dung đánh giá"),
  });

  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(schema),
  });



  useEffect(() => {
    if (evaluation) {
      const formValues = {
        title: evaluation.title,
        content: evaluation.content,
        date: evaluation.date,
        type: evaluation.type,
      };
      reset(formValues);
    }
  }, [evaluation, reset]);


  


  return (
    <>
      <form onSubmit={handleSubmit(submission)}>
        <Box
        className="formBox"
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(1, 1fr)",
        }}
      >
        <Box className="formArea" sx={{ width: "100%", gridColumn: "span 4" }}>
          <MyTextField
            className="formField"
            label={"Tiêu đề"}
            name="title"
            control={control}
          />
        </Box>
        <Box className="formArea" sx={{ gridColumn: "span 2", width: "100%" }}>
          <MyDateField
            className="formField"
            label={"Ngày đánh giá"}
            name="date"
            control={control}
            type="date"
          />
        </Box>
        <Box className="formArea" sx={{ gridColumn: "span 2", width: "100%" }}>
          <MySelectField
            className="formField"
            label={"Loại đánh giá"}
            name="type"
            options={typeOptions}
            control={control}
          />
        </Box>

        <Box className="formArea" sx={{ width: "100%", gridColumn: "span 4" }}>
          <MyDescriptionField
            className="formField"
            label={"Chi tiết đánh giá"}
            name="content"
            rows={4}
            control={control}
          />
        </Box>

        <Box className="formArea" sx={{ gridColumn: "span 4", width: "100%" }}>
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
