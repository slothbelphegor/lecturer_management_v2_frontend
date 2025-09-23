import { React, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AxiosInstance from "../../components/AxiosInstance";
import getUserRole from "../../components/GetUserRole";

import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import MyMultiSelectField from "../../components/forms/MyMultiSelectField";
import MyDateField from "../../components/forms/MyDateField";
import MyModal from "../../components/utils/MyModal";
import ScheduleInfoForm from "../../components/forms/full_forms/ScheduleInfoForm";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { useForm } from "react-hook-form";
// import { format } from "date-fns-tz";
import { format, set } from "date-fns";
import {
  isSameDay,
  addDays,
  isAfter,
  isBefore,
  getDay,
  isEqual,
} from "date-fns";

const ListSchedule = () => {
  const params = useParams();
  const lecturer_id = params.id;
  const navigate = useNavigate();
  const [currentLecturer, setCurrentLecturer] = useState({});
  const [schedules, setSchedules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedDate, setSelectedDate] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEditSuccess, setShowEditSuccess] = useState(false);
  const [showCreateSuccess, setShowCreateSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [open, setOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalContent, setModalContent] = useState();
  const role = getUserRole();

  const handleOpen = (info) => {
    setOpen(true);
    setSelectedDate(info?.dateStr);
    console.log(info?.dateStr);
  };
  const handleClose = () => setOpen(false);

  const handleCloseError = () => setError(null);
  const handleCloseEditSuccess = () => {
    setShowEditSuccess(false);
    window.location.reload();
  };
  const handleCloseCreateSuccess = () => {
    setShowCreateSuccess(false);
    window.location.reload();
  };
  const handleCloseDeleteSuccess = () => {
    setShowDeleteSuccess(false);
    window.location.reload();
  };

  const fromDateChange = (newDate) => {
    setFromDate(newDate);
  };

  const toDateChange = (newDate) => {
    setToDate(newDate);
  };

  const { control, setValue } = useForm({});

  const getData = async () => {
    setIsLoading(true);
    try {
      const lecturerResponse = await AxiosInstance.get(
        `lecturers/${lecturer_id}/`
      );
      setCurrentLecturer(lecturerResponse.data);
      console.log("Current lecturer data:", lecturerResponse.data);

      const schedulesResponse = await AxiosInstance.get(
        `schedules/by-lecturer/${lecturer_id}`
      );
      setSchedules(
        Array.isArray(schedulesResponse.data) ? schedulesResponse.data : []
      );
      const selectedCourseIds = [
        ...new Set(schedulesResponse.data.map((schedule) => schedule.course)),
      ];
      setSelectedCourses(selectedCourseIds);

      // Set the initial value for the form field
      setValue("course", selectedCourseIds);

      const coursesResponse = await AxiosInstance.get("courses/all_courses/");
      setCourses(
        Array.isArray(coursesResponse.data) ? coursesResponse.data : []
      );
    } catch (error) {
      setError("Error fetching data.");
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }

    // AxiosInstance.get(`schedules/by-lecturer/${lecturer_id}`).then((res) => {
    //   setSchedules(Array.isArray(res.data) ? res.data : []);
    //   const selectedCourseIds = [
    //     ...new Set(res.data.map((schedule) => schedule.course)),
    //   ];
    //   setSelectedCourses(selectedCourseIds);
    //   // Set the initial value for the form field
    //   setValue("course", selectedCourseIds);
    // });
    // AxiosInstance.get("courses/all_courses/").then((res) => {
    //   setCourses(Array.isArray(res.data) ? res.data : []);
    // });
  };

  useEffect(() => {
    getData();
  }, []); // get data on initial load page

  const filteredSchedules = schedules.filter(
    (schedule) =>
      selectedCourses.includes(schedule.course) &&
      (!fromDate ||
        isAfter(schedule.start, fromDate) ||
        isEqual(schedule.start, fromDate)) &&
      (!toDate ||
        isBefore(schedule.end, toDate) ||
        isEqual(schedule.end, fromDate))
  );

  // Hàm tạo màu từ tên
  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 30%)`; // sáng, dễ nhìn
    return color;
  };

  const courseOptions = Array.isArray(courses)
    ? courses.map((course) => ({
        id: course.id,
        value: course.id,
        name: course.name,
      }))
    : [];

  // Gửi dữ liệu về backend
  const createSubmission = (data) => {
    console.log("Form submitted with data:", data);
    // Parse dates
    const fromDate = data.from_date;
    const toDate = data.to_date;
    const weekday = fromDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    // Parse times
    const [startHour, startMinute] = data.start.split(":").map(Number);
    const [endHour, endMinute] = data.end.split(":").map(Number);
    // Generate all matching dates
    let current = fromDate;
    const schedulesToCreate = [];
    while (!isAfter(current, toDate) || current == toDate) {
      console.log(current);
      if (current.getDay() === weekday) {
        // Create dates in local timezone
        const startDateTime = new Date(
          current.getFullYear(),
          current.getMonth(),
          current.getDate(),
          startHour,
          startMinute,
          0
        );
        const endDateTime = new Date(
          current.getFullYear(),
          current.getMonth(),
          current.getDate(),
          endHour,
          endMinute,
          0
        );
        // Format dates with timezone offset
        const startISOString = startDateTime.toISOString();
        const endISOString = endDateTime.toISOString();
        const selectedcourseId = courses.find(
          (course) => course.name == data.course
        ).id;
        schedulesToCreate.push({
          // start: format(startDateTime, "yyyy-MM-dd'T'HH:mm:ss"),  // Changed this
          // end: format(endDateTime, "yyyy-MM-dd'T'HH:mm:ss"),      // Changed this
          start: startISOString,
          end: endISOString,
          lecturer: currentLecturer.id,
          course: selectedcourseId,
          place: data.place,
          notes: data.notes,
          title: `${data.course} - ${data.place}`,
        });
      }
      current = addDays(current, 7);
    }
    // Send all schedules to backend (batch or one by one)
    setIsSubmitting(true);
    setError(null);
    Promise.all(
      schedulesToCreate.map((schedule) =>
        AxiosInstance.post("schedules/", schedule)
      )
    )
      .then(() => {
        setShowCreateSuccess(true);
      })
      .catch((err) => {
        console.error("Error creating schedule:", err.response?.data || err);

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
            "Unexpected error occurred while creating the schedule.";
        }

        setError(errorMessage);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const editSubmission = async (data) => {
    // Parse dates and weekday
    const fromDate = data.from_date;
    const toDate = data.to_date;
    const weekday = fromDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Parse times
    const [startHour, startMinute] = data.start.split(":").map(Number);
    const [endHour, endMinute] = data.end.split(":").map(Number);

    // Find all schedules to update
    const schedulesToEdit = schedules.filter((schedule) => {
      const scheduleDate = schedule.start;
      return (
        (isAfter(scheduleDate, fromDate) ||
          isSameDay(scheduleDate, fromDate)) &&
        (isBefore(scheduleDate, toDate) || isSameDay(scheduleDate, toDate)) &&
        getDay(scheduleDate) === weekday
      );
    });

    // Prepare PATCH requests for each schedule
    const updatePromises = schedulesToEdit.map((schedule) => {
      // Combine date and time for new start/end
      const scheduleDate = new Date(schedule.start);
      const newStart = new Date(
        scheduleDate.getFullYear(),
        scheduleDate.getMonth(),
        scheduleDate.getDate(),
        startHour,
        startMinute,
        0
      );
      const newEnd = new Date(
        scheduleDate.getFullYear(),
        scheduleDate.getMonth(),
        scheduleDate.getDate(),
        endHour,
        endMinute,
        0
      );

      const selectedcourseId = courses.find(
        (course) => course.name == data.course
      ).id;

      return AxiosInstance.patch(`schedules/${schedule.id}/`, {
        start: newStart.toISOString(),
        end: newEnd.toISOString(),
        course: selectedcourseId,
        place: data.place,
        notes: data.notes,
      });
    });

    try {
      setIsSubmitting(true);
      setError(null);
      await Promise.all(updatePromises);
      setShowEditSuccess(true);
    } catch (err) {
      console.error("Error editing schedule:", err.response?.data || err);

      const errorData = err.response?.data;
      let errorMessage;

      if (errorData) {
        // Get the first error message from any field
        const firstErrorField = Object.values(errorData)[0];
        errorMessage = Array.isArray(firstErrorField)
          ? firstErrorField[0]
          : "Unexpected error occurred.";
      } else {
        errorMessage = "Unexpected error occurred while editing the schedule.";
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteSubmission = async (data) => {
    if (confirm("Are you sure?")) {
// Parse dates and weekday
    const fromDate = data.from_date;
    const toDate = data.to_date;
    const selectedcourseId = courses.find(
      (course) => course.name == data.course
    ).id;
    const weekday = fromDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Find all schedules to update
    const schedulesToDelete = schedules.filter((schedule) => {
      const scheduleDate = schedule.start;
      return (
        schedule.course == selectedcourseId &&
        (isAfter(scheduleDate, fromDate) ||
          isSameDay(scheduleDate, fromDate)) &&
        (isBefore(scheduleDate, toDate) || isSameDay(scheduleDate, toDate)) &&
        getDay(scheduleDate) === weekday
      );
    });

    const deletePromises = schedulesToDelete.map((schedule) =>
      AxiosInstance.delete(`schedules/${schedule.id}/`)
    );

    try {
      setIsSubmitting(true);
      setError(null);
      await Promise.all(deletePromises);
      setShowDeleteSuccess(true);
    } catch (err) {
      console.error("Error deleting schedule:", err.response?.data || err);

      const errorData = err.response?.data;
      let errorMessage;

      if (errorData) {
        // Get the first error message from any field
        const firstErrorField = Object.values(errorData)[0];
        errorMessage = Array.isArray(firstErrorField)
          ? firstErrorField[0]
          : "Unexpected error occurred.";
      } else {
        errorMessage = "Unexpected error occurred while deleting the schedule.";
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
    }
    
  };

  const dayClickAction = (info) => {
    handleOpen(info);
    setModalTitle("New Schedule");
    console.log(info);
    setModalContent(
      <ScheduleInfoForm
        courses={courses}
        fromDate={format(info.date, "yyyy-MM-dd")}
        submission={createSubmission}
      />
    );
  };

  const scheduleClickAction = (info) => {
    handleOpen(info);
    setModalTitle("Schedule Details");
    const formattedStartTime = format(info.event.start, "HH:mm");
    const formattedEndTime = format(info.event.end, "HH:mm");
    setModalContent(
      <ScheduleInfoForm
        courses={courses}
        startTime={formattedStartTime}
        endTime={formattedEndTime}
        fromDate={format(info.event.start, "yyyy-MM-dd")}
        courseId={info.event.extendedProps.course}
        place={info.event.extendedProps.place}
        notes={info.event.extendedProps.notes}
        submission={editSubmission}
        hasDeleteButton={true}
        deleteSubmission={deleteSubmission}
        readOnly={role !== "education_department"}
      />
    );
    console.log(info);
  };

  const selectTimeAction = (info) => {
    handleOpen(info);
    setModalTitle("New Schedule");
    console.log(info);
    const formattedStartTime = format(new Date(info.start), "HH:mm");
    const formattedEndTime = format(new Date(info.end), "HH:mm");
    console.log("Formatted Start Time:", formattedStartTime);
    console.log("Formatted End Time:", formattedEndTime);
    setModalContent(
      <ScheduleInfoForm
        courses={courses}
        startTime={formattedStartTime}
        endTime={formattedEndTime}
        fromDate={format(info.start, "yyyy-MM-dd")}
        submission={createSubmission}
      />
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", marginTop: "20px" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Box
        className="topbar"
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CalendarMonthIcon />
          <Typography
            sx={{ marginLeft: "15px", fontWeight: "bold" }}
            variant="subtitle2"
          >
            Lịch giảng dạy của giảng viên {currentLecturer.name}
          </Typography>
        </Box>
        <Box></Box>
      </Box>
      <MyModal
        open={open}
        handleClose={handleClose}
        title={modalTitle}
        content={modalContent}
      />
      <Box
        sx={{
          padding: "20px",
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        <Box sx={{ width: "33%", margin: "12px", marginTop: 0 }}>
          <MyMultiSelectField
            label={"Môn học"}
            control={control}
            name={"course"}
            options={courseOptions}
            selectedValues={selectedCourses}
            value={selectedCourses}
            onChange={(e) => {
              setSelectedCourses(e.target.value);
              console.log("Selected: ", e.target.value);
            }}
          />
        </Box>
        <Box sx={{ width: "33%", margin: "12px" }}>
          <MyDateField
            label={"Từ"}
            type="date"
            control={control}
            name="from"
            onChange={(e) => {
              fromDateChange(e);
            }}
          />
        </Box>
        <Box sx={{ width: "33%", margin: "12px" }}>
          <MyDateField
            label={"Đến"}
            type="date"
            control={control}
            name="to"
            sx={{ height: "85px" }}
            onChange={(e) => {
              toDateChange(e);
            }}
          />
        </Box>
      </Box>
      <Box sx={{ padding: "20px" }}>
        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            interactionPlugin,
          ]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,today,next",
            center: "title",
            right: "listDay,timeGridWeek,dayGridMonth",
          }}
          events={filteredSchedules}
          eventDidMount={(info) => {
            const className = info.event.classNames[0];
            if (className) {
              const color = stringToColor(className);
              info.el.style.backgroundColor = color;
            }
          }}
          eventClick={scheduleClickAction}
          dateClick={role === "education_department" ? dayClickAction : null}
          selectable={role === "education_department"}
          select={selectTimeAction}
          slotDuration="00:15:00"
          snapDuration="00:15:00"
          slotLabelInterval="01:00"
          slotMinTime="07:00:00"
          validRange={{
            start: fromDate,
            end: toDate,
          }}
        />
      </Box>
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
        open={showEditSuccess}
        autoHideDuration={6000}
        onClose={handleCloseEditSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseEditSuccess}
          severity="success"
          sx={{ width: "100%" }}
        >
          Schedule edited successfully!
        </Alert>
      </Snackbar>
      <Snackbar
        open={showCreateSuccess}
        autoHideDuration={6000}
        onClose={handleCloseCreateSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseCreateSuccess}
          severity="success"
          sx={{ width: "100%" }}
        >
          Schedule created successfully!
        </Alert>
      </Snackbar>
      <Snackbar
        open={showDeleteSuccess}
        autoHideDuration={6000}
        onClose={handleCloseDeleteSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseDeleteSuccess}
          severity="success"
          sx={{ width: "100%" }}
        >
          Schedule deleted successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ListSchedule;
