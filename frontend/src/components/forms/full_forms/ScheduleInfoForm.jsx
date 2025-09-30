import { React, useState } from "react";
import { format } from "date-fns";
import { Box, Typography } from "@mui/material";
import { useForm, useFieldArray } from "react-hook-form";
import MyTextField from "../MyTextField";
import MyButton from "../MyButton";
import MyDescriptionField from "../MyDescriptionField";
import MySelectField from "../MySelectField";
import MyDateTimeField from "../MyDateTimeField";
import MyDateField from "../MyDateField";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import MyTimeField from "../MyTimeField";

export default function ScheduleInfoForm({
  courses,
  startTime,
  endTime,
  fromDate,
  submission,
  courseId,
  place,
  notes,
  hasDeleteButton,
  deleteSubmission,
  readOnly,
}) {
  const courseOptions = courses.map((course) => ({
    id: course.name,
    value: course.name,
    name: course.name,
  }));

  useEffect(() => {
    const formValues = {};
    if (startTime) formValues.start = startTime; // startTime should be "HH:mm"
    if (endTime) formValues.end = endTime; // endTime should be "HH:mm"
    if (fromDate) formValues.from_date = fromDate;
    if (fromDate) formValues.to_date = fromDate; // You might want to change this
    if (courseId) {
      formValues.course = courses.find((item) => item.id == courseId)?.name;
    }
    if (place) formValues.place = place;
    if (notes) formValues.notes = notes;
    reset(formValues);
  }, [startTime, endTime, fromDate, courseId, place, notes, courses]);

  const schema = yup.object().shape({
    course: yup.string().required("Chưa chọn môn học"),
    start: yup.string().required("Chưa chọn giờ bắt đầu"),
    end: yup.string().required("Chưa chọn giờ kết thúc"),
    from_date: yup.date().typeError("Chưa chọn ngày bắt đầu"),
    to_date: yup.date().typeError("Chưa chọn ngày kết thúc"),
    place: yup.string().required("Chưa chọn phòng học"),
  });

  const resolvedSchema = yupResolver(schema);
  const { handleSubmit, control, register, getValues, watch, reset } = useForm({
    resolver: resolvedSchema,
  });
  if (readOnly) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Box>
          <MyTextField
            className="formField"
            label={"Môn học"}
            name="course"
            control={control}
            disabled={true}
          />
        </Box>
        <Box>
          <MyTextField
            type="time"
            className="formField"
            label={"Giờ bắt đầu"}
            name="start"
            control={control}
            disabled={true}
          />
        </Box>
        <Box>
          <MyTextField
            type="time"
            className="formField"
            label={"Giờ kết thúc"}
            name="end"
            control={control}
            disabled={true}
          />
        </Box>

        <Box>
          <MyTextField
            className="formField"
            label={"Phòng dạy"}
            name="place"
            control={control}
            disabled={true}
          />
        </Box>
        <Box>
          <MyDescriptionField
            className="formField"
            label={"Ghi chú"}
            name="notes"
            control={control}
            rows={2}
            disabled={true}
          />
        </Box>
      </Box>
    );
  } else {
    return (
      <form
        onSubmit={handleSubmit(submission, (errors) =>
          console.log("Validation Errors:", errors)
        )}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Box>
            <MySelectField
              className="formField"
              label={"Môn học"}
              name="course"
              control={control}
              options={courseOptions}
            />
          </Box>
          <Box>
            <MyTimeField
              type="time"
              className="formField"
              label={"Giờ bắt đầu"}
              name="start"
              control={control}
            />
          </Box>
          <Box>
            <MyTimeField
              type="time"
              className="formField"
              label={"Giờ kết thúc"}
              name="end"
              control={control}
            />
          </Box>
          <Box>
            <MyDateField
              type="date"
              className="formField"
              label={"Từ ngày"}
              name="from_date"
              control={control}
            />
          </Box>
          <Box>
            <MyDateField
              type="date"
              className="formField"
              label={"Đến ngày"}
              name="to_date"
              control={control}
            />
          </Box>
          <Box>
            <MyTextField
              className="formField"
              label={"Phòng dạy"}
              name="place"
              control={control}
            />
          </Box>
          <Box>
            <MyDescriptionField
              className="formField"
              label={"Ghi chú"}
              name="notes"
              control={control}
              rows={2}
            />
          </Box>

          <Box>
            <MyButton type="submit" fullWidth label={"Submit"}></MyButton>
          </Box>
          {hasDeleteButton ? (
            <MyButton
              type={"button"}
              label={"Delete"}
              sx={{ backgroundColor: "red" }}
              onClick={handleSubmit(deleteSubmission)}
            />
          ) : null}
        </Box>
      </form>
    );
  }
}
